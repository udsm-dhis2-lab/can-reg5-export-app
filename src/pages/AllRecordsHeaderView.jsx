import {
    Button,
    InputField,
    Table,
    TableHead,
    TableCellHead,
    TableRowHead,
    Switch,
} from '@dhis2/ui'

import { useDataQuery, useAlert } from '@dhis2/app-runtime'
import React, { useState, useEffect } from 'react'
import styles from './Form.module.css'
import i18n from '../locales/index.js'

import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

// Nyamata: R0kfMYExrnk
// Butaro: ImspTQPwCqd
// Rwanda: ImspTQPwCqd

const orgUnitsQuery = {
    results: {
        resource: 'organisationUnits',
        id: ({ orgUnitID }) => orgUnitID,
        params: {
            fields: ['children[name,id]'],
        },
    },
}

export const AllRecordsHeaderView = ({ onUpdateFetchInfo, provinces }) => {
    // Component's states
    const [orgUnitLevel, setOrgUnitLevel] = useState('')
    const [districts, setDistricts] = useState([])
    const [subdistricts, setSubdistricts] = useState([])
    const [sectors, setSectors] = useState([])
    const [facilities, setFacilities] = useState([])
    const [orgUnitID, setOrgUnitID] = useState('')
    const [startDate, setStartDate] = useState('')
    const [endDate, setEndDate] = useState('')
    const [checkedOrg, setCheckedOrg] = useState(false)

    const { data, refetch } = useDataQuery(orgUnitsQuery, {
        variables: { orgUnitID: 'ImspTQPwCqd' },
        lazy: true,
    })

    // A dynamic alert to communicate success or failure
    const { show } = useAlert(
        ({ message }) => message,
        ({ status }) => {
            if (status === 'success') return { success: true }
            else if (status === 'error') return { critical: true }
            else return {}
        }
    )

    const updateFilterInfoRw = () => {
        onUpdateFetchInfo(startDate, endDate, 'ImspTQPwCqd', 'DESCENDANTS')
    }

    const updateFilterInfo = () => {
        if (orgUnitID == '') {
            show({
                message: 'You did not select any Health Facility',
                status: 'error',
            })
        } else if (startDate == '' || endDate == '') {
            show({
                message: 'Make sure you select Start Date and End Date',
                status: 'error',
            })
        } else {
            onUpdateFetchInfo(startDate, endDate, orgUnitID, 'SELECTED')
        }
    }

    const onChange = ev => {
        setCheckedOrg(!checkedOrg)
    }

    const updateOrgUnitLevel = data => {
        switch (orgUnitLevel) {
            case 'Level-District':
                setDistricts(data.results.children)
                break
            case 'Level-SubDist':
                setSubdistricts(data.results.children)
                break
            case 'Level-Sector':
                setSectors(data.results.children)
                break
            case 'Level-Facility':
                setFacilities(data.results.children)
                break
            default:
                console.log('Got nothing...')
                break
        }
    }

    // Updates the org unit levels when the query finishes fetching data.
    useEffect(() => {
        if (data) {
            updateOrgUnitLevel(data)
        }
    }, [data])

    return (
        <div className="products">
            <h1>{i18n.t('Data for Export')}</h1>

            <Table>
                <TableHead>
                    <TableRowHead>
                        <TableCellHead className={styles.leftcell}>
                            <div className={styles.row}>
                                <div className={styles.downloadfiles}>
                                    <div className={styles.leftmargin}>
                                        <InputField
                                            label="Start Date"
                                            type="date"
                                            required
                                            value={startDate}
                                            onChange={({ value }) =>
                                                setStartDate(value)
                                            }
                                        />
                                    </div>
                                    <div className={styles.leftmarginsecond}>
                                        <InputField
                                            label="End Date"
                                            type="date"
                                            required
                                            value={endDate}
                                            onChange={({ value }) =>
                                                setEndDate(value)
                                            }
                                        />
                                    </div>
                                </div>
                            </div>
                        </TableCellHead>
                    </TableRowHead>
                </TableHead>
            </Table>

            <Switch
                checked={checkedOrg}
                label="Select Rwanda"
                name="rwandaSelector"
                onChange={onChange}
                value="checked"
            />

            {checkedOrg ? (
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>
                                <div className={styles.row}>
                                    <select
                                        className={styles.cbx}
                                        name="provselected"
                                    >
                                        <option
                                            key="ImspTQPwCqd"
                                            value="ImspTQPwCqd"
                                        >
                                            {' '}
                                            Rwanda{' '}
                                        </option>
                                    </select>
                                </div>
                            </TableCellHead>
                            <TableCellHead>
                                <div>
                                    <Button
                                        primary
                                        onClick={updateFilterInfoRw}
                                    >
                                        Fetch Data{' '}
                                    </Button>
                                </div>
                            </TableCellHead>
                        </TableRowHead>
                    </TableHead>
                </Table>
            ) : (
                <Table>
                    <TableHead>
                        <TableRowHead>
                            <TableCellHead>
                                <div className={styles.row}>
                                    <select
                                        className={styles.cbx}
                                        onChange={ev => {
                                            setOrgUnitLevel('Level-District')
                                            refetch({
                                                orgUnitID: ev.target.value,
                                            })
                                        }}
                                        name="provselected"
                                    >
                                        <option value="0">
                                            Select Province...
                                        </option>
                                        {provinces &&
                                            provinces.map(orgUnit => (
                                                <option
                                                    key={orgUnit.id}
                                                    value={orgUnit.id}
                                                >
                                                    {' '}
                                                    {orgUnit.name}{' '}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </TableCellHead>
                            <TableCellHead>
                                <div className={styles.row}>
                                    <select
                                        className={styles.cbx}
                                        onChange={ev => {
                                            setOrgUnitLevel('Level-SubDist')
                                            refetch({
                                                orgUnitID: ev.target.value,
                                            })
                                        }}
                                        name="provselected"
                                    >
                                        <option value="0">
                                            Select District...
                                        </option>
                                        {districts &&
                                            districts.map(orgUnit => (
                                                <option
                                                    key={orgUnit.id}
                                                    value={orgUnit.id}
                                                >
                                                    {' '}
                                                    {orgUnit.name}{' '}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </TableCellHead>
                            <TableCellHead>
                                <div className={styles.row}>
                                    <select
                                        className={styles.cbx}
                                        onChange={ev => {
                                            setOrgUnitLevel('Level-Sector')
                                            refetch({
                                                orgUnitID: ev.target.value,
                                            })
                                        }}
                                        name="provselected"
                                    >
                                        <option value="0">
                                            Select Sub-District...
                                        </option>
                                        {subdistricts &&
                                            subdistricts.map(orgUnit => (
                                                <option
                                                    key={orgUnit.id}
                                                    value={orgUnit.id}
                                                >
                                                    {' '}
                                                    {orgUnit.name}{' '}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </TableCellHead>
                            <TableCellHead>
                                <div className={styles.row}>
                                    <select
                                        className={styles.cbx}
                                        onChange={ev => {
                                            setOrgUnitLevel('Level-Facility')
                                            refetch({
                                                orgUnitID: ev.target.value,
                                            })
                                        }}
                                        name="provselected"
                                    >
                                        <option value="0">
                                            Select Sector...
                                        </option>
                                        {sectors &&
                                            sectors.map(orgUnit => (
                                                <option
                                                    key={orgUnit.id}
                                                    value={orgUnit.id}
                                                >
                                                    {' '}
                                                    {orgUnit.name}{' '}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </TableCellHead>
                            <TableCellHead>
                                <div className={styles.row}>
                                    <select
                                        className={styles.cbx}
                                        onChange={ev =>
                                            setOrgUnitID(ev.target.value)
                                        }
                                        name="provselected"
                                    >
                                        <option value="0">
                                            Select Facility...
                                        </option>
                                        {facilities &&
                                            facilities.map(orgUnit => (
                                                <option
                                                    key={orgUnit.id}
                                                    value={orgUnit.id}
                                                >
                                                    {' '}
                                                    {orgUnit.name}{' '}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </TableCellHead>

                            <TableCellHead>
                                <div className={styles.row}>
                                    <Button primary onClick={updateFilterInfo}>
                                        Fetch Data{' '}
                                    </Button>
                                </div>
                            </TableCellHead>
                        </TableRowHead>
                    </TableHead>
                </Table>
            )}
        </div>
    )
}
