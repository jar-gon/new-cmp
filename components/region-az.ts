/* eslint-disable global-require */

import { Component } from '@billyunq/react-utils/react'

import { Endpoint, EndpointRegion } from '~/models/endpoint'

import template from './region-az.pug'

const FLAG = {
  america: require('~/assets/flag/america.png'),
  australia: require('~/assets/flag/australia.png'),
  bahrain: require('~/assets/flag/bahrain.png'),
  brazil: require('~/assets/flag/brazil.png'),
  canada: require('~/assets/flag/canada.png'),
  china: require('~/assets/flag/china.png'),
  england: require('~/assets/flag/england.png'),
  france: require('~/assets/flag/france.png'),
  germany: require('~/assets/flag/germany.png'),
  india: require('~/assets/flag/india.png'),
  indonesia: require('~/assets/flag/indonesia.png'),
  ireland: require('~/assets/flag/ireland.png'),
  japan: require('~/assets/flag/japan.png'),
  korea: require('~/assets/flag/korea.png'),
  malaysia: require('~/assets/flag/malaysia.png'),
  singapore: require('~/assets/flag/singapore.png'),
  sweden: require('~/assets/flag/sweden.png'),
  united_arab_emirates: require('~/assets/flag/united_arab_emirates.png'),
}

interface RegionAzProps {
  endpoint: Endpoint
}

interface RegionAzState {
  regionLength: number
  asiaPacificRegion: EndpointRegion[]
  europeAndAmericaRegion: EndpointRegion[]
  middleEastAndIndiaRegion: EndpointRegion[]
}

class RegionAz extends Component<RegionAzProps, RegionAzState> {
  getInitialState() {
    const { regions } = this.props.endpoint
    return {
      regionLength: regions.length,
      asiaPacificRegion: regions.filter(x => x.countryRegion === 'asiaPacific'),
      europeAndAmericaRegion: regions.filter(x => x.countryRegion === 'europeAndAmerica'),
      middleEastAndIndiaRegion: regions.filter(x => x.countryRegion === 'middleEastAndIndia')
    }
  }

  render() {
    return template.call(this, { ...this, FLAG })
  }
}

export default RegionAz
