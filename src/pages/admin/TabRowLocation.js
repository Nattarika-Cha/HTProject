import React, { Component } from 'react';
import axios from 'axios';
import { Table, Button, Input, Container, Row, Col, Label, Modal, ModalHeader, ModalBody, ModalFooter, Card, CardTitle, CardText } from 'reactstrap';
var data_ss

class TabRowLocation extends Component {
  constructor(props) {
    super(props);

    this.state = {
      modal: false
    };
    this.state = {
      data: {}
    };
    this.toggle = this.toggle.bind(this);
  }

  componentWillMount() {
    data_ss = JSON.parse(sessionStorage.getItem('Login_add'))
    this.setState({ data: data_ss })
    // console.log(data_ss.Fname)
  }

  toggle() {
    this.setState({
      modal: !this.state.modal
    });
  }

  Deletelocation() {
    axios.post('http://localhost:5000/locations/Removelocation')
      .then(function (res) {
        if (res.data === 'Location has been Deleted') {
          window.location = "/setlocation"
          //console.log(item);
          console.log('OK');
        }
      })
      .catch(function (err) {
        console.log('error');
      })
  }



  render() {
    return (
      <div>
        <Row>
          <Col xs="6" sm="4">
            <Card>
              <CardTitle>{this.props.obj.Name_Lo}</CardTitle>
              <CardText>{this.props.obj.Address}</CardText>
              <CardText>{this.props.obj.date}</CardText>
              <Button href="/setbuild" color="primary">เพิ่มอาคาร</Button>
              <Button onClick={this.toggle} color="secondary">การจัดการ</Button>
            </Card>
          </Col>
        </Row>
        <br /><br />

        {/* เมนูตัวเลือกด้านใน */}
        <Modal isOpen={this.state.modal}
          toggle={this.toggle}
          className={this.props.className}>

          <ModalHeader toggle={this.toggle}>พื้นที่</ModalHeader>
          <form onSubmit={this.onSubmit}>
            <ModalBody>
              <Container>
                <Table>
                  <Row>
                    <Col>
                      <Label>ชื่อสถานที่</Label>
                      <Input className="form-control" name="location" value={this.props.obj.Name_Lo} onChange={this.onchangeNameLocation}></Input>
                    </Col>
                  </Row>
                  <br />
                  <Row>
                    <Col>
                      <Label>ที่อยู่</Label>
                      <Input type="textarea" cols="30" rows="10" value={this.props.obj.Address} onChange={this.onchangeAddress}></Input>
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Label>ผู้แก้ไข</Label>
                      <Input type="text" name="location" value={data_ss.Fname} disabled></Input>
                    </Col>
                  </Row>
                  <br />
                </Table>
              </Container>
            </ModalBody>
            <ModalFooter>
              <Button color="info" onClick={this.toggle}>แก้ไขข้อมูล</Button>{' '}
              <Button color="danger" onClick={this.Deletelocation}>ลบข้อมูล</Button>
              <Button color="secondary" onClick={this.toggle}>ยกเลิก</Button>
            </ModalFooter>
          </form>
        </Modal>
      </div>


    );
  }
}

export default TabRowLocation;