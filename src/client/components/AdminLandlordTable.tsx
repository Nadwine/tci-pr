import PropTypes from 'prop-types'
import React from 'react'
import { connect } from 'react-redux'

export const AdminLandlordTable = (props) => {
  return (
    <div>AdminLandlordTable
        <table className="table table-striped table-hover"></table>
    </div>
  )
}


const mapStateToProps = (state) => ({})

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(AdminLandlordTable)