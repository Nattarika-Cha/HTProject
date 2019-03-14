import React from 'react';
import axios from 'axios';
import { Table, Button, Input, Container, Row, Col } from 'reactstrap';
import SenserChoice from '../Choice/SenserChoice';
import Chart from '../Chart';
import moment from 'moment';

var _mac, mac, Build, Location, Dht, Authorize, Senser;
var sen_num, bu_num, Loca_num, dht_num, aut_num;
var data_ss, num = 0;
var count, seconds = 1;
var data = [];
var show = [], show_num = 0;

export default class monitoring_user extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {},
    }

    this.state = { Authorize: [], Senser: [], Location: [], Dht: [], time: {} };
    this.timer = 0;
    this.startTimer = this.startTimer.bind(this);
    this.countDown = this.countDown.bind(this);

  }

  secondsToTime(secs) {
    let hours = Math.floor(secs / (60 * 60));

    let divisor_for_minutes = secs % (60 * 60);
    let minutes = Math.floor(divisor_for_minutes / 60);

    let divisor_for_seconds = divisor_for_minutes % 60;
    let seconds = Math.ceil(divisor_for_seconds);

    let obj = {
      "h": hours,
      "m": minutes,
      "s": seconds
    };
    return obj;
  }

  componentWillMount() {
    _mac = this.props.match.params.id
    data_ss = JSON.parse(sessionStorage.getItem('Login_user'))

    //console.log(_mac)
  }

  componentDidMount() {
    // let timeLeftVar = this.secondsToTime(seconds);
    // this.setState({ time: timeLeftVar });
    axios.get('http://localhost:5000/authorize/authorize_list')
      .then(response => {
        Authorize = response.data;
        aut_num = response.data.length;
        // this.setState({ Authorize });
        // console.log(Authorize);
      })
      .catch(function (error) {
        console.log(error);
      })

    axios.get('http://localhost:5000/sensers/senser_list')
      .then(response => {
        Senser = response.data;
        sen_num = response.data.length;
        this.setState({ Senser: Senser });
        //console.log(Senser);
      })
      .catch(function (error) {
        console.log(error);
      })

    axios.get('http://localhost:5000/build/build_list')
      .then(response => {
        Build = response.data;
        bu_num = response.data.length;
        this.setState({ Build: Build });
        // console.log(Build);
        // console.log(bu_num);
      })
      .catch(function (error) {
        console.log(error);
      })

    axios.get('http://localhost:5000/locations/location_list')
      .then(response => {
        Location = response.data;
        Loca_num = response.data.length;
        this.setState({ Location: Location });
        // console.log(Location);
      })
      .catch(function (error) {
        console.log(error);
      })

    axios.get('http://localhost:5000/dht/dht_list')
      .then(response => {
        Dht = response.data;
        dht_num = response.data.length;
        this.setState({ Dht: Dht });
        // console.log(Dht)
      })
      .catch(function (error) {
        console.log(error);
      })
  }

  loopdht() {
    console.log('dhtupdate')
    axios.get('http://localhost:5000/dht/dht_list')
      .then(response => {
        Dht = response.data;
        dht_num = response.data.length;
        this.setState({ Dht: Dht });
        // console.log(Dht)
      })
      .catch(function (error) {
        console.log(error);
      })
    count = 0;
  }


  sentid = (e) => {
    window.location.replace('/user/monitoring/' + mac)
  }

  onchangeMAC(e) {
    mac = e.target.value
  }

  choice() {
    // return this.state.Senser.map((object, i) => {
    //   for (let z = 0; z < bu_num; z++) {
    //     if (object.Id_Build === Build[z]._id) {
    //       for (let y = 0; y < Loca_num; y++) {
    //         if (Build[z].Id_Loca === Location[y]._id) {
    //           if (data_ss._id === Location[y].Id_Admin) {
    //             return <SenserChoice obj={object} key={i} />;
    //           }
    //         }
    //       }
    //     }
    //   }
    //   return true
    // });
    show = [];
    show_num = 0;
    return this.state.Senser.map(function (object, i) {
      for (let z = 0; z < bu_num; z++) {
        if (object.Id_Build === Build[z]._id) {
          for (let y = 0; y < Loca_num; y++) {
            if (Build[z].Id_Loca === Location[y]._id) {
              for (let i = 0; i < aut_num; i++) {
                if (object.Key_Room === Authorize[i].Key_Room) {
                  if (data_ss._id === Authorize[i].Id_User) {
                    show[show_num] = {
                      Name_Lo: Location[y].Name_Lo,
                      Name_Build: Build[z].Name_Build,
                      Position: object.Position,
                      Temp_Low: object.Temp_Low,
                      Temp_Hight: object.Temp_Hight,
                      Humdi_Low: object.Humdi_Low,
                      Humdi_Hight: object.Humdi_Hight,
                      Macaddress: object.Macaddress
                    }
                    show_num = show_num + 1
                    return <SenserChoice obj={object} key={i} />;
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  showData() {
    if (_mac !== "undefined") {
      console.log("No deil")
      for (let i = 0; i < show_num; i++) {
        if (_mac === show[i].Macaddress) {
          return <Table>
            <Row>
              <Col>
                <div>ข้อมูลตั้งค่า</div>
              </Col>
              <Col>
                <div>ข้อมูลเซนเซอร์ </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>สถานที่ : {show[i].Name_Lo}</div>
              </Col>
              <Col>
                <div>อุณหภูมิสูงสุด : {show[i].Temp_Hight} </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>อาคาร : {show[i].Name_Build}</div>
              </Col>
              <Col>
                <div>อุณหภูมิตำสุด : {show[i].Temp_Low} </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>ห้องติดตั้งเซนเซอร์ : {show[i].Position}</div>
              </Col>
              <Col>
                <div>ความชื้นสูงสุด : {show[i].Humdi_Hight} </div>
              </Col>
            </Row>
            <Row>
              <Col>
                <div>รหัสเครื่อง : {show[i].Macaddress}</div>
              </Col>
              <Col>
                <div>ความชื้นสูงสุด : {show[i].Humdi_Low} </div>
              </Col>
            </Row>
          </Table>
        }
      }
    }
  }

  dateNow() {
    if (_mac !== "undefined") {
      return moment().format('MMMM Do YYYY, h:mm:ss a')
    }
  }

  showbar() {
    if (_mac !== "undefined") {
      return this.state.Dht.map((object, i) => {
        // console.log(i)
        // console.log(dht_num-1)
        if (object.mac === _mac) {
          // console.log(i)
          // console.log(num)
          data[num] = object
          // console.log(data[num])
          num = num + 1
        }
        if (i === (dht_num - 1)) {
          // console.log(data)
          return <Chart obj={data} key={num} />;
          //return <MonitorChoice obj={data} key={num} />; 
        }
      });
    }
  }

  startTimer() {
    console.log('start');
    if (this.timer == 0 && seconds > 0) {
      this.timer = setInterval(this.countDown, 10000);
      // this.state.down = 1;
    }
    // this.showbar()
  }

  countDown() {
    count = 1;
    // Remove one second, set state so a re-render happens.
    let seconds = this.state.seconds - 1;
    this.setState({
      time: this.secondsToTime(seconds),
      seconds: seconds,
    });

    // Check if we're at zero.
    if (seconds == 0) {
      clearInterval(this.timer);

    }
  }

  render() {
    if (seconds == 1) {
      console.log('render 1')
      this.startTimer()

    } if (count == 1) {
      console.log('render 2')
      this.loopdht()
    }

    return (
      <div>
        <section id="space">
          <div className="banner-h">
            <div className="text-cobg">
              การตรวจสอบข้อมูลอุณหภูมิและความชื้น
                    </div>
          </div>
        </section>
        <Container>
          <Table>
            <Row align="center">
              <Col>
                <Input type="select" name="select" onChange={this.onchangeMAC}>
                  <option>เลือกเซนเซอร์</option>
                  {this.choice()}
                </Input>
              </Col>
              <Col>
                <Button color="success" onClick={(e) => this.sentid(e)}>ค้นหา</Button>
              </Col>
            </Row>
            <br />
          </Table>
          {this.showData()}
          <Table>
            <Row align="right"><Col> {this.dateNow()} </Col></Row>
          </Table>
        </Container>


        <Row >
          <Col md={11} style={{ paddingLeft: '150px', paddingBottom: '20px' }}> <div className="chart">
            {/* <Chart /> */}
            {this.showbar()}
            {/* กราฟที่โชว์ */}
          </div>
          </Col>
        </Row>
      </div>
    );
  }
}