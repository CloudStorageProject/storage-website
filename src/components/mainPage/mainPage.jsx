import React from "react";
import Sidebar from "./components/Sidebar";
import "./mainpage.css";
import { getFolders } from "../../service/FolderService";
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
        getFolders().then(
            (response) => {
                const [data, error] = response || [null, "Error"];
                if (data) {
                    this.state.folders = data.folders;
                    this.state.files = data.files;
                } else {
                    this.state.error = error;
                }
            }
        );
    }

    downloadFile(file) {
        performDownload(file, this.props.privateKey);
    }

    uploadFile(files) {
        for (const file of files) {
            // TODO: Implement progress indication
            DataTransferWorker.onmessage = (event) => {

                if (event.data.state === TransferState.COMPLETE || event.data.state === TransferState.PARTIAL) {
                    uploadFileFull(event.data.message);
                } else if (event.data.state === TransferState.ACCEPTED || event.data.state === TransferState.IN_PROGRESS) {
                    // TODO: Implement Partial progress
                } else {
                    this.state.error = event.data.message;
                }
            };
            DataTransferWorker.postMessage({ action: TransferAction.UPLOAD, file: file, key: exportPublicKeyToBase64(this.props.keyPair.publicKey) });
        }
    }

    changeCategory(category) {
        this.setState({ selectedCategory: category });
        localStorage.setItem("selectedCategory", category);
    }

    renderContent() {
        switch (this.state.selectedCategory) {
            case "MyDisk":
                return <MyDisk folders={this.state.folders} files={this.state.files} error={this.state.error} uploadFile={this.uploadFile.bind(this)} downloadFile={this.downloadFile.bind(this)} />;
            case "OpenedToMe":
                return <OpenedToMe folders={this.state.folders} files={this.state.files} error={this.state.error} uploadFile={this.uploadFile.bind(this)} downloadFile={this.downloadFile.bind(this)} />;
            case "Trash":
                return <Trash folders={this.state.folders} files={this.state.files} error={this.state.error} uploadFile={this.uploadFile.bind(this)} downloadFile={this.downloadFile.bind(this)} />;
            default:
                return <p>Виберіть категорію у меню.</p>;
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
