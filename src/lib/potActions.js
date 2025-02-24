import User from '@/models/User'
import Pot from '@/models/Pot'

export async function getPotsByUser(userEmail) {
    try {
        const currentUser = await User.findOne({ email: userEmail })
        const pots = await Pot.find({ user: currentUser._id })
        return pots
    } catch (error) {
        console.error(error)
        return null
    }
}