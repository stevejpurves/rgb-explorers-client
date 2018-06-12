import React from 'react'
import {Image, Label, Form, Radio, Button} from 'semantic-ui-react'
import { Slider } from 'react-semantic-ui-range'
import log from './images/log.png'
import spectralplot from './images/spectralplot.png'
import './VisSection.css'
import SeismicControls from './SeismicControls'
import fetchDataFrom from "./fetchDataFrom";


class RGBLog extends React.Component  {

    state = {
        data: null
    }

    fetchRGBData = async () => {
        const {f_r, f_g, f_b} = this.props;

        let data = null;
        try {
            data = await fetchDataFrom("http://127.0.0.1:5000/api/rgb_log_png", {
                query: {
                    f_r,
                    f_g,
                    f_b,
                    dpi:180
                }
            })
        }
        catch(error) {
            console.log(error)
            this.setState({error})
        }

        this.setState({data});
    }

    componentDidMount = async () => {
        this.fetchRGBData();
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {data} = this.state;
        const {f_r, f_g, f_b} = this.props;
        if (f_r !== nextProps.f_r || f_g !== nextProps.f_g ||
            f_b !== nextProps.f_b || data !== nextState.data) {
            return true;
        }
        return false;
    }

    componentDidUpdate = async () => {
        console.log("RGSeismic::componentDidUpdate", this.state)
        this.fetchRGBData();
    }

    render() {
        const {data} = this.state;
        return (
            <div className="vis-flex-item rgblog-panel">
                {data && <Image src={data} />}
            </div>)
    }
}


const FreqSlider = ({title, color, start, onChange}) => {
    return (<div className="freqslider-panel">
        <Label className="vis-flex-item" color={color}>{title}</Label>
        <div className="freqslider">
            <Slider color={color} settings={{
                start: start,
                value: start,
                min: 3,
                max: 80,
                step: 1,
                onChange
            }}
            />
        </div>
        <div>
            {start} Hz
        </div>
    </div>)
}

class SpectralPlot extends React.Component {

    // state = {
    //     data: null
    // }
    //
    // fetchRGBData = async () => {
    //     const {f_r, f_g, f_b} = this.props;
    //
    //     let data = null;
    //     try {
    //         data = await fetchDataFrom("http://127.0.0.1:5000/api/rgb_log_png", {
    //             query: {
    //                 f_r,
    //                 f_g,
    //                 f_b,
    //                 dpi:180
    //             }
    //         })
    //     }
    //     catch(error) {
    //         console.log(error)
    //         this.setState({error})
    //     }
    //
    //     this.setState({loading: false, error:'', data});
    // }
    //
    // componentDidMount = async () => {
    //     this.fetchRGBData();
    // }

    render() {
        // const {data} = this.state;
        const {f_r, f_g, f_b, onChangeRed, onChangeGreen, onChangeBlue} = this.props;
        return (
            <div className="vis-flex-item spectralplot-panel">
                <Image src={spectralplot} />
                <FreqSlider title="R" color="red" start={f_r} onChange={onChangeRed}/>
                <FreqSlider title="G" color="green" start={f_g} onChange={onChangeGreen}/>
                <FreqSlider title="B" color="blue" start={f_b}  onChange={onChangeBlue}/>
                <Button color="red">Optimise</Button>
            </div>)
    }
}

const WellLog = () => {
    return (<div className="vis-flex-item welllog-panel">
        <Image src={log}/>
    </div>)
}

class VisSection extends React.Component {

    state = {
        f_r: 10,
        f_g: 20,
        f_b: 30
    }

    onRed = (value) => {
        this.setState({f_r: value})
    }

    onGreen = (value) => {
        this.setState({f_g: value})
    }

    onBlue = (value) => {
        this.setState({f_b: value})
    }

    render() {
        const {f_r, f_g, f_b} = this.state;
        return (<div className="vis-section">
            <WellLog />
            <SpectralPlot f_r={f_r} f_g={f_g} f_b={f_b}
                          onChangeRed={this.onRed} onChangeGreen={this.onGreen} onChangeBlue={this.onBlue}/>
            <RGBLog f_r={f_r} f_g={f_g} f_b={f_b} />
            <SeismicControls f_r={f_r} f_g={f_g} f_b={f_b}/>
        </div>)
    }
}

export default VisSection;