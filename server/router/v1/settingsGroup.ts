import { Router } from 'express'
import { UserRole } from '@prisma/client'
import { userAuth } from '../../middleware/userAuth'
import * as SettingsController from '../../controllers/settings.Controller'

const router = Router()

// Settings routes - mostly admin only as these are system-wide settings
router.get('/', SettingsController.getAllSettings)
router.get('/setting', SettingsController.getSettingByKey)
router.post('/', userAuth([UserRole.ADMIN]), SettingsController.createSetting)
router.put(
  '/',
  userAuth([UserRole.ADMIN]),
  SettingsController.updateSetting,
)
router.delete(
  '/',
  userAuth([UserRole.ADMIN]),
  SettingsController.deleteSetting,
)

export default router
