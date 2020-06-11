
import URI from 'urijs';
import * as React from 'react'
import { Popover } from 'react-bootstrap'
import { Rights } from './types'
import ReactHtmlParser from 'react-html-parser'

 type Props = {
  rightsList: [Rights]
}


const CcLicense: React.FunctionComponent<Props> = ({rightsList}) => {

  const Tooltips = [
    { key: 'cc', title: 'Creative Commons (CC)', text: 'A Creative Commons license enables the free distribution of an otherwise copyrighted work.' },
    { key: 'by', title: 'Attribution (BY)', text: 'Licensees may copy, distribute, display and perform the work and make derivative works and remixes based on it only if they give the author or licensor the credits (attribution) in the manner specified by these.' },
    { key: 'sa', title: 'Share-alike (SA)', text: 'Licensees may distribute derivative works only under a license identical ("not more restrictive") to the license that governs the original work.'},
    { key: 'nc', title: 'Non-commercial (NC)', text: 'Licensees may copy, distribute, display, and perform the work and make derivative works and remixes based on it only for non-commercial purposes.' },
    { key: 'nd', title: 'No Derivative Works (ND)', text: 'Licensees may copy, distribute, display and perform only verbatim copies of the work, not derivative works and remixes based on it.' },
    { key: 'zero', title: 'Public Domain (Zero)', text: 'Copyright holder has waived the copyright interest and has dedicated the work to the world-wide public domain.' },
  ];



  const licenceses = () => {

    if (!rightsList ) return '';

    const licensesList = rightsList.map(rights => {

      let uri = new URI(rights.licenseURL);
      let licenseLogo = null;
      if (uri.hostname() === 'creativecommons.org') {
        let labels = uri.segment(1).split('-');
        labels.unshift('cc');
        let val = null;
  
        licenseLogo = labels.reduce(function(sum, key) {
          if (('public publicdomain').includes(key)) {
            key = 'zero';
          }
          if (('cc by nd nc sa zero').includes(key)) {
            val = { class: 'cc cc-' + key, tooltip: (Tooltips).find(e => e.key === key) };
            (sum).pushObject(val);
          }
          return sum;
        }, []);
      } else if (uri.hostname() === 'opensource.org') {
        switch (uri.segment(1)) {
          case 'MIT':
            licenseLogo = [ { logo: ReactHtmlParser('<img src="https://img.shields.io/:license-MIT-blue.svg" />') } ];
        }
      }

      let license = {
        id: rights.key,
        licenseLogo: licenseLogo,
        tooltip: {
          title: rights.title,
          text: rights.text,
        },
      }
      return license;
    })

    const r = licensesList.map((license) =>
      <i key={license.id} className={license.class}>
        <Popover title={license.tooltip.title}>{license.tooltip.text}</Popover>
      </i>
    );

    return (
      {r}
    )
  }

  return ( 
    <div className="license">
      {licenceses()}
    </div>
   );
}


export default CcLicense
