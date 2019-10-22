import React from 'react'
import '../../styles/components/AdminModal.scss'
import CustomButton from '../CustomButton'
import { connect } from 'react-redux'
import { createStructuredSelector } from 'reselect'
import { selectAlertModal } from '../../redux/selectors/alertSelectors'
import { removeModal } from '../../redux/actions/alertActions'
import { deleteProduct } from '../../redux/actions/inventoryActions'

const AdminModal = ({ modal, onClick, removeModal, deleteProduct }) => {
  
  const handleClick = () => {
    onClick(false)
    removeModal()
  }
  
  const handleDelete = async () => {
    await deleteProduct(modal.extraInfo.id)
    onClick(false)
    removeModal()
  }

  return !modal ? null : (
    <div className='AdminModal'>
      <h2 className='AdminModal__title'>{ modal.title }</h2>
      <p className='AdminModal__subtitle'>{ modal.subTitle }</p>
      <div className='AdminModal__buttons'>
        <CustomButton onClick={handleClick}>Cancel</CustomButton>
        <CustomButton onClick={handleDelete} specialBgColor='#D44A4A'>Delete</CustomButton>
      </div> 
    </div>
  )
}

const mapStateToProps = createStructuredSelector({
  modal: selectAlertModal
})

export default connect(mapStateToProps, { removeModal, deleteProduct })(AdminModal)
