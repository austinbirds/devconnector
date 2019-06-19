import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileEducation = ({education: {school, degree, fieldOfStudy, current, to, from, description}}) => (
    // <div>sample</div>
    <div>
        <h3 className="text-dark">{school}</h3>
        <p>
            <Moment format='MMM-YY'>{from}</Moment> - {' '} {!to ? 'Now': <Moment format='MMM-YY'>{to}</Moment>}
        </p>
        <p>
            <strong>Degree: </strong> {degree}
        </p>
        <p>
            <strong>Major: </strong> {fieldOfStudy}
        </p>
        <p>
            <strong>Description: </strong> {description}
        </p>
    </div>
)

ProfileEducation.propTypes = {
    education: PropTypes.array.isRequired
}

export default ProfileEducation
