import React from "react";
import Sidebar from "./components/Sidebar";
import "./mainpage.css";
import MyDisk from "./categories/MyDisk";
import OpenedToMe from "./categories/OpenedToMe";
import Trash from "./categories/Trash";
import { DataTransferWorker, performDownload, uploadFileFull } from "../../service/FileService.jsx";
import { exportPublicKeyToBase64 } from "../../utils/Cryptography.jsx";
import { TransferAction, TransferState } from "../../service/TransferWorker/DataTransferEnums.jsx";

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
                return <MyDisk error={this.state.error} />;
            case "OpenedToMe":
                return <OpenedToMe error={this.state.error} />;
            case "Trash":
                return <Trash error={this.state.error} />;
            default:
                return <MyDisk error={this.state.error} />;
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
