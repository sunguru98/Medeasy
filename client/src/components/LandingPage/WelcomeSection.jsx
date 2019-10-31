import React, { useState } from 'react'
import CustomButton from '../CustomButton'
import CustomFormElement from '../CustomFormElement'
import PhoneFormElement from '../PhoneFormElement'
// Images
import { ReactComponent as LeftArrow } from '../../images/larrow.svg'
import { ReactComponent as RightArrow } from '../../images/rarrow.svg'
import carouselImg from '../../images/carouselimg.png'

const WelcomeSection = () => {
	const [formState, setFormState] = useState({
		name: '',
		phNumber: '',
		message: ''
	})

	const handleChange = event =>
		setFormState({ ...formState, [event.target.name]: event.target.value })
	const handleSubmit = event => event.preventDefault()

	const { name, phNumber, message } = formState
	return (
		<div className="LandingPage__welcome">
			<div
				className="LandingPage__welcome--carousel"
				style={{ backgroundImage: `url(${carouselImg})` }}
			>
				<LeftArrow className="LandingPage__welcome--carousel-left" alt="left" />
				<RightArrow
					className="LandingPage__welcome--carousel-left"
					alt="right"
				/>
			</div>
			<div className="LandingPage__helpform">
				<h2 className="LandingPage__helpform-title">
					Want us to call you back ?
				</h2>
				<form className="LandingPage__helpform-form" onSubmit={handleSubmit}>
					<CustomFormElement
						labelName="Name"
						onChange={handleChange}
						name="name"
						type="text"
						id="name"
						value={name}
					/>
					<PhoneFormElement value={phNumber} onChange={handleChange} />
					<label htmlFor="message">Message</label>
					<CustomFormElement
						noLabel
						isTextArea
						value={message}
						onChange={handleChange}
						name="message"
						id="message"
					/>
					<CustomButton isSubmitButton fontSize="1.6rem">
						Request Callback
					</CustomButton>
				</form>
			</div>
		</div>
	)
}

export default WelcomeSection
