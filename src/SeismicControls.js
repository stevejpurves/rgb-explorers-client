import React from 'react';
import './VisSection.css'
import {Image, Label, Form, Radio, Button, Loader, Message} from 'semantic-ui-react'
import { Slider } from 'react-semantic-ui-range'
import {fetch, createClient} from "fetch-plus";
import fetchDataFrom from './fetchDataFrom'

const DIMS = {
    'x': [250,502,1],
    'y': [320,560,1],
    't': [-8,1848,4]
}

const DEFAULT_INDEX = {
    'x': 319,
    'y': 460,
    't': 1000
}

const LABEL = {
    'x': 'inline',
    'y': 'xline',
    't': 'time'
}

const SeismicPlot = ({data}) => {
    return (<div className="vis-flex-item seismic-plot">
        <Image fluid src={data} />
    </div>)
}

class SeismicControls extends React.Component {

    state = {
        loading: true,
        error: '',
        value: 'x',
        label: 'inline',
        index: DEFAULT_INDEX['x'],
        data: null
    }

    fetchRGBData = async ({value, index}) => {
        const {f_r, f_g, f_b} = this.props;

        let data = null;
        try {
            data = await fetchDataFrom("http://127.0.0.1:5000/api/seismic_blend_png", {
                query: {
                    direction: value,
                    index,
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

        this.setState({loading: false, error:'', data});
    }

    shouldComponentUpdate(nextProps, nextState) {
        const {data, index, direction} = this.state;
        const {f_r, f_g, f_b} = this.props;
        if (f_r !== nextProps.f_r ||
            f_g !== nextProps.f_g ||
            f_b !== nextProps.f_b ||
            index !== nextState.index ||
            direction !== nextState.direction ||
            data !== nextState.data) {
            return true;
        }
        return false;
    }

    componentDidMount = async () => {
        this.fetchRGBData(this.state)
    }

    componentDidUpdate = async () => {
        console.log("RGSeismic::componentDidUpdate", this.state)
        this.fetchRGBData(this.state)
    }


    radioChange = (e, {value}) => {
        this.setState({value, index: DEFAULT_INDEX[value]}) //, async state => await this.fetchRGBData(state))
    }

    sliderChange = async (index) => {
        this.setState({index}) //, async state => await this.fetchRGBData(state))

    }

    jumpToWell = async () => {
        this.setState(state => ({index: DEFAULT_INDEX[state.value]}))//, async state => await this.fetchRGBData(state))
    }

    render() {
        const {loading, error, data} = this.state;

        let the_plot = null;

        the_plot = <SeismicPlot data={data} />

        return (
            <div className="vis-flex-item seismic-panel">
                {the_plot}
                <div className="seismicontrols">
                    <Form className="pad-top">
                        <Form.Field>
                            Selected value: <b>{this.state.label}</b>
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='inline'
                                name='radioGroup'
                                value='x'
                                checked={this.state.value === 'x'}
                                onChange={this.radioChange}
                            />
                        </Form.Field>
                        <Form.Field>
                            <Radio
                                label='xline'
                                name='radioGroup'
                                value='y'
                                checked={this.state.value === 'y'}
                                onChange={this.radioChange}
                            />
                        </Form.Field>
                        {/*<Form.Field>*/}
                            {/*<Radio*/}
                                {/*label='time'*/}
                                {/*name='radioGroup'*/}
                                {/*value='t'*/}
                                {/*checked={this.state.value === 't'}*/}
                                {/*onChange={this.radioChange}*/}
                            {/*/>*/}
                        {/*</Form.Field>*/}
                    </Form>
                    <div className="pad-top" >
                        <Slider settings={{
                            start: this.state.index,
                            value: this.state.value,
                            min: DIMS[this.state.value][0],
                            max: DIMS[this.state.value][1],
                            step: DIMS[this.state.value][2],
                            onChange: this.sliderChange }}
                        />
                        {this.state.index}
                    </div>
                    <div className="pad-top">
                        <Button className="pad-top" color="green"
                            onChange={this.jumpToWell}>Jump to Well</Button>
                    </div>
                </div>
            </div>)

    }
}

export default SeismicControls;
