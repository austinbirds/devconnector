import React from 'react'
import PropTypes from 'prop-types'
import Moment from 'react-moment'

const ProfileExperience = ({experience: {company, title, location, current, to, from, description}}) => (
    // <div>sample</div>
    <div>
        <h3 className="text-dark">{company}</h3>
        <p>
            <Moment format='MMM-YY'>{from}</Moment> - {' '} {!to ? 'Now': <Moment format='MMM-YY'>{to}</Moment>}
        </p>
        <p>
            <strong>Position: </strong> {title}
        </p>
        <p>
            <strong>Description: </strong> {description}
        </p>
    </div>
)

ProfileExperience.propTypes = {
    experience: PropTypes.array.isRequired
}

export default ProfileExperience
