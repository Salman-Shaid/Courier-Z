
import axios from "axios"
import { User } from "lucide-react"
// upload image and return image api
export const imageUpload = async ImageData => {
    const formData = new FormData()
    formData.append('image', ImageData)

    const { data } = await axios.post(
        `https://api.imgbb.com/1/upload?key=${import.meta.env.VITE_IMGBB_API_KEY}`, formData 
    )
    return data.data.display_url
}

export const saveUser = async user => {
    await axios.post(
        `${import.meta.env.VITE_API_URL}/users/${user?.email}`, 
        {
        name: user?.displayName,   
        image: user?.photoURL,
        email: user?.email,
        role: 'customer',
        
        }
      )
}