import { useEffect, useState } from "react";
import { useAuth } from "../../../hooks/AuthProvider.jsx";
import { changePassword, changePayment, changeUsername, getPayments } from "../../../service/SettingsService.jsx";
import { useNotify } from "../../../hooks/Notification/NotificationProvider.jsx";
import { NotificationType } from "../../../hooks/Notification/NotificationTypes.tsx";
import { PlanStructure } from "../../../utils/Structures.tsx";
import { getMe } from "../../../api/authRequests.jsx";
import { loadStripe } from '@stripe/stripe-js';
import { testPassword, testUserName } from "../../../utils/InputValidations.tsx";




const stripePromise = loadStripe(window.__ENV__.STRIPE_PUBLIC_KEY);
const ProfileSettings = () => {
    const auth = useAuth();
    const notify = useNotify();
    const [plans, setPlans] = useState([]);
    const [isYearly, setIsYearly] = useState(false);
    const [userdata, setUserData] = useState({ subscription_name: "", subscription_id: 0, username: "", space_taken: 0 });
    const [new_username, setNewUsername] = useState(auth.user.username);
    const [new_password, setNewPassword] = useState("");
    const [old_password, setOldPassword] = useState("");
    const [passwordChanged, setPasswordChanged] = useState(false);
    const [usernameChanged, setUsernameChanged] = useState(false);

    // Fetch the plans from the server
    // fetch the user data from the server
    useEffect(() => {
        const fetchPlans = async () => {
            getPayments().then((response) => {
                var tmp = [];
                for (let i = 0; i < response.data.length; i++) {
                    const el = response.data[i];
                    tmp.push(new PlanStructure(el.name, el.space, el.price, el.description, el.price, el.price * 12));
                }
                setPlans(tmp);
            }).catch((error) => {
                console.error(error);
                notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
            });
            getMe().then((response) => {
                setUserData(response.data);
            }).catch((error) => {
                console.error(error);
                notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
            });
        };
        fetchPlans();
    }, [notify]);

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
        if (e.target.value.length > 0) {
            setPasswordChanged(true);
        } else {
            setPasswordChanged(false);
        }
    }

    const handleUserNameChange = (e) => {
        setNewUsername(e.target.value);
        if (auth.user.username !== e.target.value) {
            setUsernameChanged(true);
        } else {
            setUsernameChanged(false);
        }
    }

    const changeSubscription = (name) => {
        if (userdata.subscription_name === name) {
            notify.postNotification("You are already subscribed to this plan", NotificationType.INFO);
            return;
        } else {
            const plan = plans.find((plan) => plan.name === name);
            if (!plan) {
                notify.postNotification("Invalid plan name", NotificationType.ERROR);
                return;
            }
            if (userdata.space_taken > plan.space) {
                notify.postNotification("You need to delete some files to change your plan", NotificationType.ERROR);
                return;
            } else {
                changePayment(plan.name).then(async (response) => {
                    if (response.error) {
                        notify.postNotification(response.error, NotificationType.ERROR);
                    } else {
                        const stripe = await stripePromise;
                        if (!stripe) {
                            notify.postNotification("Stripe failed to load", NotificationType.ERROR);
                            return;
                        }
                        const result = await stripe.redirectToCheckout({ sessionId: response.data.id });
                        if (result.error) {
                            notify.postNotification("Failed to redirect to checkout", NotificationType.ERROR);
                        }
                    }
                }).catch((error) => {
                    console.error(error);
                    notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
                });
            }
        }
    }

    const updateChanges = () => {
        try {
            testPassword(old_password);
        } catch (error) {
            notify.postNotification(error, NotificationType.ERROR);
            return;
        }
        if (passwordChanged) {
            try {
                testPassword(new_password);
                changePassword(old_password, new_password).then((response) => {
                    if (response.error) {
                        notify.postNotification(response.error, NotificationType.ERROR);
                    } else {
                        notify.postNotification("Password changed successfully", NotificationType.SUCCESS);
                    }
                }).catch((error) => {
                    console.error(error);
                    notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
                });
            } catch (error) {
                notify.postNotification(error, NotificationType.ERROR);
                return;
            }
        }
        if (usernameChanged) {
            try {
                testUserName(new_username);
                changeUsername(old_password, new_username).then((response) => {
                    if (response.error) {
                        notify.postNotification(response.error, NotificationType.ERROR);
                    } else {
                        notify.postNotification("Username changed successfully", NotificationType.SUCCESS);
                        auth.updateUser({ ...auth.user, username: new_username });
                        auth.reLogin();
                    }
                }).catch((error) => {
                    console.error(error);
                    notify.postNotification("Network error", NotificationType.NETWORK_ERROR);
                });
            } catch (error) {
                notify.postNotification(error, NotificationType.ERROR);
                return;
            }
        }
    }


    return (
        <div className="content-container settings-container">
            <div className="profile-settings">
                <div className="profile-settings-part">
                    <label htmlFor="username">Username</label>
                    <input type="text" name="username" value={new_username} onChange={(e) => { handleUserNameChange(e); }} />
                </div>
                <div className="profile-settings-part">
                    <label htmlFor="password">Password</label>
                    <input type="password" name="password" placeholder="New password" value={new_password} onChange={(e) => { handlePasswordChange(e); }} />
                </div>

                <div className="profile-settings-part">
                    <div className="pricing-header-settings">
                        <div className="pricing-header-title-settings">
                            <h2>Change Your Plan</h2>
                            <div className="toggle-settings">
                                <button className={`toggle-btn-settings ${!isYearly ? 'active' : ''}`} onClick={() => setIsYearly(false)}>Month</button>
                                <button className={`toggle-btn-settings ${isYearly ? 'active' : ''}`} onClick={() => setIsYearly(true)}>Year</button>
                            </div>
                        </div>


                        <div className="plan-cards">
                            {plans.map((plan) => (
                                <div className="card-settings" key={plan.name} onClick={() => { changeSubscription(plan.name) }}>
                                    <h3>{plan.name}</h3>
                                    <p>{plan.description}</p>
                                    <div className="circle-settings"><span>{plan.space}</span></div>
                                    <p className="price">{isYearly ? `${plan.priceYear}$ per year` : `${plan.priceMonth}$ per month`}</p>
                                    <div className="arrow">{plan.name === userdata.subscription_name ? "Current" : "→"}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            <div className="profile-settings-confirm">
                <input type="password" name="username" placeholder="Old password" value={old_password} onChange={(e) => { setOldPassword(e.target.value) }} disabled={!(passwordChanged || usernameChanged)} />
                <button disabled={!(passwordChanged || usernameChanged)} onClick={() => { updateChanges() }}>Save</button>
            </div>
        </div>
    );
}

export default ProfileSettings;