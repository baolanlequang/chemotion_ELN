import React, {Component, PropTypes} from 'react';
import {ListGroup, ListGroupItem, Button, ButtonToolbar, Well} from 'react-bootstrap';
import ContainerDatasetModal from './ContainerDatasetModal';
import ContainerDatasetField from './ContainerDatasetField';
import Container from './models/Container';
import AttachmentDropzone from './AttachmentDropzone'

export default class ContainerDatasets extends Component {
  constructor(props) {
    super(props);
    const {container} = props;
    this.state = {
      container,
      modal: {
        show: false,
        dataset_container: null
      }
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      container: nextProps.container
    })
  }

  handleModalOpen(dataset_container) {
    const {modal} = this.state;
    modal.dataset_container = dataset_container;
    modal.show = true;
    this.setState({modal});
  }

  handleAdd(){
    const {container} = this.state;
    let dataset_container = Container.buildEmpty();
    dataset_container.container_type = "dataset";

    container.children.push(dataset_container);

    this.handleModalOpen(dataset_container);
    this.props.onChange(container);

  }

  handleAddWithAttachment(attachment){
    const {container} = this.state;
    let dataset_container = Container.buildEmpty();
    dataset_container.container_type = "dataset";

    dataset_container.attachments.push(attachment)
    container.children.push(dataset_container);

    this.handleModalOpen(dataset_container);
    this.props.onChange(container);

  }

  handleRemove(dataset_container) {
    let {container} = this.state;

    dataset_container.is_deleted = true;
    this.props.onChange(container);
  }

  handleUndo(dataset_container) {
    let {container} = this.state;

    dataset_container.is_deleted = false;
    this.props.onChange(container);
  }

  handleChange(dataset_container){
    let {container} = this.state;

    container.children.find(dataset => {
      if(dataset.id == dataset_container.id) {
        const datasetId = container.children.indexOf(dataset);
        container.children[datasetId] = dataset_container;
      }
    });

    this.props.onChange(container);
  }

  handleModalHide() {
    const {modal} = this.state;
    modal.show = false;
    modal.dataset_container = null;
    this.setState({modal});
    // https://github.com/react-bootstrap/react-bootstrap/issues/1137
    document.body.className = document.body.className.replace('modal-open', '');
  }

  addButton() {
    const {readOnly, disabled} = this.props;

    if(!readOnly && !disabled) {
      return (
        <div className="pull-right" style={{marginTop: 5, marginBottom: 5}}>
        <AttachmentDropzone
          handleAddWithAttachment={(attachment) => this.handleAddWithAttachment(attachment)}
          />
          &nbsp;&nbsp;&nbsp;
          <Button bsSize="xsmall" bsStyle="success" onClick={() => this.handleAdd()}>
            <i className="fa fa-plus"></i>
          </Button>


        </div>
      )
    }
  }



  render() {
    const {container, modal} = this.state;
    const {disabled} = this.props;

    if(container.children.length > 0) {
      return (
        <div>
          <Well style={{minHeight: 70, padding: 5, paddingBottom: 31}}>
            <ListGroup style={{marginBottom: 0}}>
              {container.children.map((dataset_container, key) => {
                return (
                  <ListGroupItem key={key}>
                    <ContainerDatasetField
                      dataset_container={dataset_container}
                      handleRemove={() => this.handleRemove(dataset_container)}
                      handleUndo={() => this.handleUndo(dataset_container)}
                      handleModalOpen={() => this.handleModalOpen(dataset_container)}
                      disabled={disabled}
                    />
                  </ListGroupItem>
                )
              })}
            </ListGroup>
            {this.addButton()}
          </Well>
          <ContainerDatasetModal
            onHide={() => this.handleModalHide()}
            onChange = {dataset_container => this.handleChange(dataset_container)}
            show={modal.show}
            readOnly={this.props.readOnly}
            dataset_container={modal.dataset_container}
            disabled={disabled}
            />
        </div>
      );
    } else {
      return (
        <div>
          <Well style={{minHeight: 70, padding: 10}}>
            There are currently no Datasets.<br/>
            {this.addButton()}
          </Well>
        </div>
      )
    }
  }
}
