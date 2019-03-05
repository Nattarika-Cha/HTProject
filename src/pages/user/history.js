import React, { Component } from 'react';
import { Table, Button, Input, FormGroup, Form, Container, Row, Col } from 'reactstrap';
import axios from 'axios';
import Tablehistory from './Tabalhistory';
import SenserChoice from './SenserChoice';
import moment from 'moment';
var _mac , _dateP , mac , date , Build;

class history extends Component {
    constructor(props) {
        super(props);

        this.state = { History: [], Senser: [], Location: [] };
        
    }

    componentWillMount() {
        _mac = this.props.match.params.id
        _dateP = this.props.match.params.date
        var test = moment('2019-02-18 08:37:51.968Z').format('YYYY-MM-DD')
        //console.log(test)
        console.log(_mac)
        console.log(_dateP)
    }

    componentDidMount() {
        axios.get('http://localhost:5000/history')
            .then(response => {
                const History = response.data;
                this.setState({ History:History });
                //console.log(History)
            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://localhost:5000/sensers/senser_list')
            .then(response => {
                const Senser = response.data;
                this.setState({ Senser:Senser });
                //console.log(Senser);
            })
            .catch(function (error) {
                console.log(error);
            })
        
        axios.get('http://localhost:5000/build/build_list')
            .then(response => {
                Build = response.data;
                //this.setState({ Build: Build});
                //console.log(Build);
            })
            .catch(function (error) {
                console.log(error);
            })

        axios.get('http://localhost:5000/locations/location_list')
            .then(response => {
                const Location = response.data;
                this.setState({ Location: Location });
                //console.log(Locatio);
            })
            .catch(function (error) {
                console.log(error);
            })
    }

    onchangeMAC(e) {
        mac = e.target.value
    }

    onchangeDate(e) {
        date = e.target.value
        console.log(date)
    }

    // onSubmit(e) {
    //     window.location.replace('/history/' + this.state.mac)
    //     console.log(this.state.mac)
    // }

    sentid = (e) => {
        window.location.replace('/history/' + mac + '/' + date)
    }

    tabRow() {
        return this.state.History.map(function (object, i) {
            const _date = moment(object.date).format('YYYY-MM-DD')
            var set = "undefined"
            console.log(set)
            if(_mac !== set && _dateP === set)
            {
                if (_mac === object.mac)
                    return <Tablehistory obj={object} key={i} />;
            } 
            else if(_mac === set && _dateP !== set)
            {
                if (_dateP === _date)
                    return <Tablehistory obj={object} key={i} />;
            }
            else if(_mac !== set && _dateP !== set)
            {
                if (_mac === object.mac && _dateP === _date)
                    return <Tablehistory obj={object} key={i} />;
            }
            
        });
    }

    choice() {
        return this.state.Senser.map(function (object, i) {
            // console.log(i)
            console.log(Build);
                return <SenserChoice obj={object} key={i} />;
            
        });
    }

    render() {
        //console.log(this.state.Build);
        return (
            <div>
                <div>
                    <section id="space">
                        <div className="banner-h">
                            <div className="text-cobg">
                                test
                    </div>
                        </div>
                    </section>
                    <Container>
                        <Form>
                            <Row align="center">
                                <Col>
                                    <Input type="select" name="select" onChange={this.onchangeMAC}>
                                        <option>เลือกเซนเซอร์</option>
                                        {this.choice()}
                                    </Input>
                                </Col>

                                <Col>
                                    <Input
                                        type="date"
                                        name="date"
                                        id="exampleDate"
                                        placeholder="ระบุวันเดือนปี"
                                        onChange={this.onchangeDate}
                                    />
                                </Col>

                                <Col>
                                    <Button color="success" onClick={(e) => this.sentid(e)}>ตกลง</Button>
                                </Col>
                            </Row>
                        </Form>
                        <Form>
                            <Table bordered>
                                <thead>
                                    <tr>
                                        <td>อุณหภูมิ</td>
                                        <td>ความชื้น</td>
                                        <td>รหัสเครื่อง</td>
                                        <td>วันที่และเวลา</td>
                                    </tr>
                                </thead>
                                <tbody>
                                    {this.tabRow()}
                                </tbody>
                            </Table>
                        </Form>
                    </Container>

                </div>
            </div >
        );
    }
}

export default history;