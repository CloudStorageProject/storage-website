import React from "react";
import Sidebar from "./components/Sidebar";
import "./mainpage.css";
import MyDisk from "./categories/MyDisk";
import OpenedToMe from "./categories/OpenedToMe";
import ProfileSettings from "./categories/ProfileSettings.jsx";
import './categories/categories.css'

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedCategory: localStorage.getItem("selectedCategory") || "MyDisk",
        };
    }



    changeCategory(category) {
        this.setState({ selectedCategory: category });
        localStorage.setItem("selectedCategory", category);
    }

    renderContent() {
        switch (this.state.selectedCategory) {
            case "MyDisk":
                return <MyDisk />;
            case "OpenedToMe":
                return <OpenedToMe />;
            case "Profile settings":
                return <ProfileSettings />;
            default:
                return <MyDisk />;
        }
    }

    render() {
        return (
            <div className="main-page">
                <Sidebar onSelectCategory={(category) => this.changeCategory(category)} activeCategory={this.state.selectedCategory} />
                {this.renderContent()}
            </div>
        );
    }
}
