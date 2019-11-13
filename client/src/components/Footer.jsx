import React from 'react'
import { Link } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
	faEnvelope,
	faPhoneAlt,
	faClock,
} from '@fortawesome/free-solid-svg-icons'
import { } from '@fortawesome/free-brand-svg-icons'
import { ReactComponent as CopyrightIcon } from '../images/copyright.svg'
import '../styles/components/Footer.scss'

const Footer = () => {
	return (
		<div className="Footer">
			<div className="Footer__info">
				<div className="Footer__info-contact">
					<p className="Footer__info-title">CONTACT</p>
					<a href="tel:+1-555-5777-572">
						<FontAwesomeIcon icon={faPhoneAlt} /> +1-555-5777-572
					</a>
					<a href="mailto:contact@medeasyonline.com">
						<FontAwesomeIcon icon={faEnvelope} /> contact@medeasyonline.com
					</a>
					<span style={{ cursor: 'default' }}>
						<FontAwesomeIcon icon={faClock} /> We are open 24 X 7
					</span>
				</div>
				<div className="Footer__info-useful">
					<p className="Footer__info-title">RESOURCES</p>
					<Link to="/affliates">Affiliates</Link>
					<Link to="/faq">FAQ</Link>
					<Link to="/delivery">Delivery and Returns</Link>
					<Link to="/profile/orders">Order Status</Link>
					<Link to="/bitcoin-tutorial">How to buy Bitcoins</Link>
					<Link to="/privacy">Privacy Policy</Link>
				</div>
			</div>
			<div className="Footer__copyright">
				<CopyrightIcon alt="copyright" />
				<span className="Footer__copyright--text">
					2019{' '}
					<Link to="/">
						<span style={{ color: '#1b6355' }}>MedEasy.</span>
					</Link>
					&nbsp;&nbsp;All Rights Reserved
				</span>
			</div>
		</div>
	)
}

export default Footer
