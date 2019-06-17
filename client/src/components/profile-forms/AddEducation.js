import React, {Fragment, useState} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import { addEducation } from '../../actions/profile'
import {Link, withRouter } from 'react-router-dom';

const AddEducation = ({addEducation, history}) => {

    const [formData, setFormData] = useState({
        school: '',
        degree: '',
        fieldOfStudy:'',
        from:'',
        to:'',
        current: false,
        description:''
    });

    const [toDateDisabled, toggleDisabled] = useState(false);

    const { school, degree, fieldOfStudy, from, to, current, description } = formData;

    const onChange = e => setFormData({...formData, [e.target.name]: e.target.value})

    return (
        <Fragment>
            <h1 className="large text-primary">
            Add Education Details
            </h1>
            <p className="lead">
                <i className="fas fa-code-branch"></i> Add any school or bootcamp that you have attended
            </p>
            <small>* = required field</small>
            <form className="form" onSubmit={e => {
                e.preventDefault(); 
                addEducation(formData, history);
                }}>
                <div className="form-group">
                <input type="text" placeholder="* School / bootcamp" name="school" value={school} onChange={e=> onChange(e)} required />
                </div>
                <div className="form-group">
                <input type="text" placeholder="* degree / certificate" name="degree" value={degree} onChange={e=> onChange(e)} required />
                </div>
                <div className="form-group">
                <input type="text" placeholder="field of study" name="fieldOfStudy"  value={fieldOfStudy} onChange={e=> onChange(e)}/>
                </div>
                <div className="form-group">
                <h4>From Date</h4>
                <input type="date" name="from" value={from} onChange={e=> onChange(e)} />
                </div>
                <div className="form-group">
                <p><input type="checkbox" name="current" checked={current} value="current" onChange={e => { 
                    setFormData({...formData, current: !current });
                    toggleDisabled(!toDateDisabled);
                    }}/> {' '} Currently pursuing</p>
                </div>
                <div className="form-group">
                <h4>To Date</h4>
                <input type="date" name="to" value={to} onChange={e=> onChange(e)} disabled={toDateDisabled ? 'disabled':''} />
                </div>
                <div className="form-group">
                <textarea
                    name="description"
                    cols="30"
                    rows="5"
                    placeholder="List down any achievements"
                    value={description} onChange={e=> onChange(e)}
                ></textarea>
                </div>
                <input type="submit" className="btn btn-primary my-1" />
                <Link className="btn btn-light my-1" to="/dashboard">Go Back</Link>
            </form>
        </Fragment>
    )
}

AddEducation.propTypes = {
    addEducation : PropTypes.func.isRequired
}

export default connect(null, {addEducation})(AddEducation);
