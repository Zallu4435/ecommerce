import { Outlet } from 'react-router-dom'

const AdminOutlet = () => {
  return (
    <div className='adminBg'>
      <Outlet />
    </div>
  )
}

export default AdminOutlet
