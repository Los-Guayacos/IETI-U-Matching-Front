import React, { useState } from 'react'
// import TinderCard from '../react-tinder-card/index'
import TinderCard from 'react-tinder-card'
import App from '../../App'

const db = [
  {
    name: 'Luffy',
    url: './img/luffy.jpg',
    description: 'El rey de los piratas'
  },
  {
    name: 'Fuque es re bambaro',
    url: './img/jorgito.jpg',
    description: 'Chupalooo!'
  },
  {
    name: 'Bandida de Indigo',
    url: './img/indigo.jpg',
    description: 'Mamá luchona'
  },
  {
    name: 'Bandida de Roots',
    url: './img/roots.jpg',
    description: 'De medallo bebé'
  },
  {
    name: 'Bandida de Tierra bomba',
    url: './img/tierrab.jpg',
    description: 'Me gustan colombianos'
  }
]

export default function Matching () {
  const characters = db
  const [lastDirection, setLastDirection] = useState()

  const swiped = (direction, nameToDelete) => {
    console.log('removing: ' + nameToDelete)
    setLastDirection(direction)
  }

  const outOfFrame = (name) => {
    console.log(name)
  }

  return (
    <div>
      <link href='https://fonts.googleapis.com/css?family=Damion&display=swap' rel='stylesheet' />
      <link href='https://fonts.googleapis.com/css?family=Alatsi&display=swap' rel='stylesheet' />
      <h1>U-MATCHING</h1>
      <div className='cardContainer'>
        {characters.map((character) =>
          <TinderCard className='swipe' key={character.name} onSwipe={(dir) => swiped(dir, character.name)} onCardLeftScreen={() => outOfFrame(character.name)}>
            <div style={{ backgroundImage: 'url(' + character.url + ')' }} className='card'>
              <h3>{character.description}</h3>
              <h2>{character.name}</h2>
            </div>
          </TinderCard>
        )}
      </div>
      {lastDirection ? <h2 className='infoText'>{lastDirection == "left" ? "NO GUSTA" : "SI GUSTA"}</h2> : <h2 className='infoText' />}
    </div>
  )
}