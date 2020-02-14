import React from 'react';
import { Scene } from 'react-native-router-flux';
import {
  HintFindStation,
  HintScanQr,
  HintSaved,
  HintBringback,
  HintRecommend,
} from './index';
import GeneralHintContainer from './GeneralHintContainer';

const HINT_FINT_STATION_IMAGE = require('~/common/assets/images/png/guide-find-station.png');
const HINT_SCAN_STATION_IMAGE = require('~/common/assets/images/png/guide-scan.png');
const HINT_RECHARGE_IMAGE = require('~/common/assets/images/png/guide-save.png');
const HINT_BRING_BACK_IMAGE = require('~/common/assets/images/png/guide-bring-back.png')



const hintRouts = [
  {
    routeName: 'hint_find_station',
    image: HINT_FINT_STATION_IMAGE,
    title: 'Find a station',
    description: 'The app guides you to the nearest partner site',
    buttonText: 'Next',
    backPath: null,
    nextPath: 'hint_scan_station'
  },
  {
    routeName: 'hint_scan_station',
    image: HINT_SCAN_STATION_IMAGE,
    title: 'Scan and unlock a nono',
    description: 'Scan the QR code on the station. Your nono is unlocked!',
    buttonText: 'Next',
    backPath: 'hint_find_station',
    nextPath: 'hint_recharge'
  },
  {
    routeName: 'hint_recharge',
    image: HINT_RECHARGE_IMAGE,
    title: 'Free recharge for 48 hours',
    description: 'Bring back the battery before the 48h so as not to be debited from the deposit',
    buttonText: 'Next',
    backPath: 'hint_scan_station',
    nextPath: 'hint_bringback'
  },
  {
    routeName: 'hint_bringback',
    image: HINT_BRING_BACK_IMAGE,
    title: 'Bring back your nono',
    description: 'Choose the nearest partner institution',
    buttonText: 'Next',
    backPath: 'hint_recharge',
    nextPath: null
  },
]

export default HintStack = (
  <Scene key='hint' hideNavBar>
    {hintRouts.map(hintRoute => {
      return(
        <Scene 
          key={hintRoute.routeName}
          hideNavBar
          component={() =>{
            return (
            <GeneralHintContainer
              image={hintRoute.image}
              title={hintRoute.title}
              description={hintRoute.description}
              buttonText={hintRoute.buttonText}
              backPath={hintRoute.backPath}
              nextPath={hintRoute.nextPath}
            />)}
          }
        />);
    })}
  </Scene>
);
