/* eslint-disable global-require */

const ICONS = {
  arch: require('~/assets/os/arch.svg'),
  atomic: require('~/assets/os/atomic.svg'),
  centos: require('~/assets/os/centos.svg'),
  coreos: require('~/assets/os/coreos.svg'),
  debian: require('~/assets/os/debian.svg'),
  fedora: require('~/assets/os/fedora.svg'),
  opensuse: require('~/assets/os/opensuse.svg'),
  redhat: require('~/assets/os/redhat.svg'),
  suse: require('~/assets/os/suse.svg'),
  ubuntu: require('~/assets/os/ubuntu.svg'),
  windows: require('~/assets/os/windows.svg'),
  'windows-2003': require('~/assets/os/windows-2003.svg'),
  'windows-2008': require('~/assets/os/windows-2008.svg'),
  'windows-2012': require('~/assets/os/windows-2012.svg'),
  mariadb: require('~/assets/os/mariadb.svg'),
  mysql: require('~/assets/os/mysql.svg'),
  postgresql: require('~/assets/os/postgresql.svg'),
  redis: require('~/assets/os/redis.svg'),
  sqlserver: require('~/assets/os/sqlserver.svg'),
  unknown: require('~/assets/os/unknown.svg'),
}

const SIMPLE_OS = [
  'arch',
  'atomic',
  'centos',
  'coreos',
  'debian',
  'fedora',
  'opensuse',
  'redhat',
  'suse',
  'ubuntu',
  'mariadb',
  'mysql',
  'postgresql',
  'redis',
  'sqlserver',
]

export function ConvertInstanceIcon(props: { os: string }) {
  let icon: string = ICONS.unknown
  const os = props.os.toLowerCase()
  if (os.includes('windows')) {
    icon = ICONS.windows
    if (os.includes('2003')) {
      icon = ICONS['windows-2003']
    } else if (os.includes('2008')) {
      icon = ICONS['windows-2008']
    } else if (os.includes('2012')) {
      icon = ICONS['windows-2012']
    }
  } else {
    const iconSimple = SIMPLE_OS.find(x => os.includes(x))
    if (iconSimple) {
      icon = ICONS[iconSimple]
    }
  }
  return <img className="instance-icon" alt={ os } src={ icon } />
}
