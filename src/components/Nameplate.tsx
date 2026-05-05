import React from 'react';

type NameplateType = 'runner' | 'commentator' | 'host';

export interface NameplateProps {
  player: Speedcontrol.Player
  type: NameplateType;
  isTalking?: boolean;
}

function getNameplateIcon(type: NameplateType) {
  switch (type) {
    case 'runner':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M448 128C554 128 640 214 640 320C640 426 554 512 448 512L192 512C86 512 0 426 0 320C0 214 86 128 192 128L448 128zM192 240C178.7 240 168 250.7 168 264L168 296L136 296C122.7 296 112 306.7 112 320C112 333.3 122.7 344 136 344L168 344L168 376C168 389.3 178.7 400 192 400C205.3 400 216 389.3 216 376L216 344L248 344C261.3 344 272 333.3 272 320C272 306.7 261.3 296 248 296L216 296L216 264C216 250.7 205.3 240 192 240zM432 336C414.3 336 400 350.3 400 368C400 385.7 414.3 400 432 400C449.7 400 464 385.7 464 368C464 350.3 449.7 336 432 336zM496 240C478.3 240 464 254.3 464 272C464 289.7 478.3 304 496 304C513.7 304 528 289.7 528 272C528 254.3 513.7 240 496 240z"/>
        </svg>
      )
    
    case 'commentator':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M144 336C144 288.7 109.8 249.4 64.8 241.5C72 177.6 126.2 128 192 128L448 128C513.8 128 568 177.6 575.2 241.5C530.2 249.5 496 288.7 496 336L496 368L144 368L144 336zM0 448L0 336C0 309.5 21.5 288 48 288C74.5 288 96 309.5 96 336L96 416L544 416L544 336C544 309.5 565.5 288 592 288C618.5 288 640 309.5 640 336L640 448C640 483.3 611.3 512 576 512L64 512C28.7 512 0 483.3 0 448z"/>
        </svg>
      )

    case 'host':
      return (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640">
          <path d="M320 64C267 64 224 107 224 160L224 288C224 341 267 384 320 384C373 384 416 341 416 288L416 160C416 107 373 64 320 64zM176 248C176 234.7 165.3 224 152 224C138.7 224 128 234.7 128 248L128 288C128 385.9 201.3 466.7 296 478.5L296 528L248 528C234.7 528 224 538.7 224 552C224 565.3 234.7 576 248 576L392 576C405.3 576 416 565.3 416 552C416 538.7 405.3 528 392 528L344 528L344 478.5C438.7 466.7 512 385.9 512 288L512 248C512 234.7 501.3 224 488 224C474.7 224 464 234.7 464 248L464 288C464 367.5 399.5 432 320 432C240.5 432 176 367.5 176 288L176 248z"/>
        </svg>
      );
  }
}

export const Nameplate: React.FC<NameplateProps> = ({
  type,
  player,
  isTalking,
}) => {
  return (
    <div className="nameplate">
      <div className="nameplate__icon">
        {getNameplateIcon(type)}
      </div>
      <div className="nameplate__name">
        {player.name}
      </div>
      {player.pronouns && (
        <div className="nameplate__pronouns">
          {player.pronouns}
        </div>
      )}
    </div>
  )
}