import React from "react";
import Sidebar from "./components/Sidebar";
import "./mainpage.css";

import MyDisk from "./categories/MyDisk";
import OpenedToMe from "./categories/OpenedToMe";
import Trash from "./categories/Trash";

export default class MainPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = { 
            selectedCategory: localStorage.getItem("selectedCategory") || "MyDisk" 
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
            case "Trash":
                return <Trash />;
            default:
                return <p>Виберіть категорію у меню.</p>;
        }
    }

    render() {
        return (
            <div className="main-page">
                <Sidebar onSelectCategory={(category) => this.changeCategory(category)} />
                {this.renderContent()}
            </div>
        );
    }
}
