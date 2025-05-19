import { Router } from 'express'
import { UserRole } from '@prisma/client'
import { userAuth } from '../../middleware/userAuth'
import * as UserController from '../../controllers/user.Controller'

const router = Router()

// User routes
router.post('/', UserController.createUser)
router.get('/logout', UserController.logoutUser)
router.post('/login',  UserController.loginUser)

router.get('/', userAuth([UserRole.ADMIN]), UserController.getUser)
router.put('/', userAuth([UserRole.ADMIN]), UserController.updateUser)
router.delete('/', userAuth([UserRole.ADMIN]), UserController.deleteUser)
router.get('/all', userAuth([UserRole.ADMIN]), UserController.getAllUsers)

// Password reset routes
router.post('/reset-password', UserController.resetPassword)
router.post('/request-reset-password', UserController.requestResetPassword)

router.get(
  '/refresh',
  userAuth([UserRole.ADMIN, UserRole.USER]),
  UserController.refreshUser,
)
router.get(
  '/search',
  userAuth([UserRole.ADMIN, UserRole.USER]),
  UserController.searchUser,
)
router.put(
  '/phone',
  userAuth([UserRole.ADMIN, UserRole.USER]),
  UserController.updateUserPhone,
)

export default router
