import React from 'react'
import { Row, Col, Content, Box, DataTable } from 'adminlte-2-react'
const axios = require('axios').default

const SERVER = 'https://p2wdb.fullstack.cash/'
const EXPLORER_URL = 'https://explorer.bitcoin.com/bch/tx/'

let _this
class Explorer extends React.Component {
  constructor (props) {
    super(props)
    _this = this
    this.state = {
      data: [],
      firstColumns: [
        { title: 'Created At', data: 'createdAt' },
        {
          title: 'Transaction ID',
          data: 'txid',
          render: txid => <span id={txid.subString}>{txid.subString}</span>
        },
        {
          title: 'Hash',
          data: 'hash',
          render: hash => (
            <span
              onclick={() => {
                console.log('test')
              }}
              id={hash.subString}
            >
              {hash.subString}
            </span>
          )
        },
        { title: 'App Id', data: 'appId' }
      ],
      entries: []
    }
  }

  render () {
    const { data, firstColumns } = _this.state
    return (
      <Content
        title='P2WDB Explorer'
        subTitle='Block Explorer for P2WDB'
        browserTitle='P2WDB Explorer'
      >
        <Row>
          <Col xs={12}>
            <Box title='Block explorer for P2WDB'>
              <DataTable
                columns={firstColumns}
                data={data}
                options={{
                  paging: true,
                  lengthChange: false,
                  searching: false,
                  ordering: true,
                  info: true,
                  autoWidth: true
                }}
                onPageChange={_this.handleEvents}
              />
            </Box>
          </Col>
        </Row>
      </Content>
    )
  }

  async componentDidMount () {
    const entries = await _this.getEntries()
    _this.generateDataTable(entries)
  }

  async componentDidUpdate () {
    // Adds new 'click' events when the view is updated
    const { entries } = _this.state
    _this.handleEvents(entries)
  }

  // REST petition to Get data fron the pw2db
  async getEntries () {
    try {
      const options = {
        method: 'GET',
        url: `${SERVER}entry/all/${0}`,
        data: {}
      }
      const result = await axios.request(options)
      console.log('result', result.data)
      _this.setState({
        entries: result.data.data
      })
      return result.data.data
    } catch (err) {
      console.warn('Error in getEntries() ', err)
    }
  }

  generateDataTable (dataArr) {
    try {
      const data = []
      for (let i = 0; i < dataArr.length; i++) {
        const entry = dataArr[i]
        const row = {
          createdAt: entry.createdAt,
          txid: {
            subString: _this.simplifyString(entry.key),
            value: entry.key
          },
          hash: {
            subString: _this.simplifyString(entry.hash),
            value: entry.hash
          },
          appId: entry.appId
        }
        data.push(row)
      }
      _this.setState({
        data
      })
    } catch (err) {
      console.warn('Error in generateDataTable() ', err)
    }
  }

  simplifyString (txid) {
    try {
      const subTxid = txid.slice(0, 4)
      const subTxid2 = txid.slice(-4)
      return `${subTxid}...${subTxid2}`
    } catch (err) {
      console.warn('Error in cutTxid() ', err)
    }
  }

  handleTxId (txid) {
    try {
      window.open(`${EXPLORER_URL}${txid}`, '_blank')
    } catch (err) {
      console.warn('Error in handleTxId() ', err)
    }
  }

  // Gets each element of the transaction id column
  // to add them the onClick event, its done this way
  // because that event is not recognized if it gets
  // added directly to the html tag
  handleEvents () {
    try {
      const { entries } = _this.state
      for (let i = 0; i < entries.length; i++) {
        const entry = entries[i]
        const txid = _this.simplifyString(entry.key)
        const element = document.getElementById(txid)
        if (element) {
          // Adding on click event
          element.addEventListener('click', () => {
            _this.handleTxId(entry.key)
          })
        }
      }
    } catch (err) {
      console.warn('Error in handleEvents() ', err)
    }
  }
}

export default Explorer
