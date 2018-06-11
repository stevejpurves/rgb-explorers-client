import React from 'react'
import './UploadSection.css'
import {Dropdown, Button} from 'semantic-ui-react'

const UploadSection = () => {
    return (
        <div className="upload-section">
            <div className="upload-flex-item">Dataset: F3 Netherlands</div>
            <Button className="upload-flex-item" color="green">Upload Well</Button>
        </div>
    );
}




export default UploadSection;