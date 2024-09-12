import '../styles/card.css'
import todo from '../assets/icons_FEtask/To-do.svg'
import done from '../assets/icons_FEtask/Done.svg'
import { useState } from 'react'
// import profile from '../assets/icons_FEtask/profile.svg'
// import iconw from '../assets/icons_FEtask/in-progress.svg'


export default function Card({id, availability, title, icon, tag, dp, option}) {

    const [check, setCheck] = useState(false)

    return (
        <>
            <div className="container">
                <div className="sec1">
                    <p className='id'>{id}</p>
                    {option != 'user' &&  
                    <div className="image-cont">
                    <img src={dp} />
                    <div className={availability}></div>
                </div>}
                    
                </div>
                <div className="sec2">
                    {option != 'state' && 
                    <button onClick={() => setCheck(x => !x)}>
                        <img src={check ? done : todo} />
                    </button>}
                    
                    <p className="title">{title}</p>
                </div>
                <div className="sec3">
                    <img className='icon' src={icon} />
                    {
                        tag.map((item, i) => {
                            return (
                                <div key={i} className='tag-cont'>
                                    <div className="grey-dot"></div>
                                    <p className="tag">{item}</p>
                                </div>
                            )
                        })
                    }
                    
                </div>
            </div>
        </>
    )
}