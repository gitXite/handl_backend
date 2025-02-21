const router = express.Router();
const authMiddleware = require('../middleware/authMiddleware');
const authController = require('../controllers/authController');


// Profile api route
router.get('/profile', authMiddleware.isAuthenticated, authController.getProfile);


module.exports = router;
