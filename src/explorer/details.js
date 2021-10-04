import React from 'react'
import PropTypes from 'prop-types'
import { Row, Col, Box, Button } from 'adminlte-2-react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

let _this
class Details extends React.Component {
  constructor (props) {
    super(props)

    _this = this

    this.state = {
      entry: {},
      entryData: {}
    }
  }

  render () {
    const { entry, entryData } = _this.state
    return (
      <>
        <Row>
          <Col sm={12}>
            <Box className=' border-none mt-2' loaded={!this.state.inFetch}>
              <Row className='text-center'>
                <Col sm={12}>
                  <h1 id='SendTokens'>
                    <FontAwesomeIcon
                      className='title-icon'
                      size='xs'
                      icon='info-circle'
                    />
                    <span>Details</span>
                  </h1>
                  {entry._id && (
                    <Box className='border-none details-data-content'>
                      <p>
                        <b>IS VALID: </b>
                        {entry.isValid}
                      </p>
                      <p>
                        <b>APP ID: </b>
                        {entry.appId || 'none'}
                      </p>
                      <p>
                        <b>CREATE AT: </b>
                        {new Date(entry.createdAt).toLocaleString()}
                      </p>
                      <p>
                        <b>ID: </b>
                        {entry._id}
                      </p>
                      <p>
                        <b>HASH: </b>
                        {entry.hash}
                      </p>
                      <p>
                        <b>TRANSACTION ID : </b>
                        {entry.key}
                      </p>
                      {entryData && (
                        <>
                          <b>VALUE : </b>
                          <p>
                            - <b>Message : </b> {entryData.message}
                          </p>
                          <p>
                            - <b>Signature : </b> {entryData.signature}
                          </p>
                          <p>
                            - <b>Data : </b> {_this.formatData(entryData.data)}
                          </p>
                        </>
                      )}
                    </Box>
                  )}
                </Col>
                <Col sm={12}>
                  <div className='btn-wrapper'>
                    <Button
                      text='Close'
                      type='primary'
                      className='btn-lg btn-close-entry mr-1 ml-1 mt-1'
                      onClick={_this.handleClose}
                    />
                  </div>
                </Col>
              </Row>
            </Box>
          </Col>
        </Row>
      </>
    )
  }

  componentDidMount () {
    _this.handleData()
  }

  componentDidUpdate () {
    if (_this.props.entry._id !== _this.state.entry._id) {
      _this.handleData()
    }
  }

  handleData () {
    try {
      const { entry } = _this.props
      _this.setState({
        entry,
        entryData: entry.value
      })
    } catch (err) {
      console.warn('Error in handleData()', err)
    }
  }

  handleClose () {
    _this.props.onClose()
  }

  formatData (data) {
    try {
      const parsed = JSON.parse(data)
      const str = JSON.stringify(parsed, null, 2)

      return str
    } catch (error) {
      console.warn('error in formatData', error)
      return data
    }
  }
}
Details.propTypes = {
  entry: PropTypes.object,
  onClose: PropTypes.func
}
export default Details