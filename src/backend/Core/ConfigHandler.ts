//props https://github.com/Nordstrom/config/blob/master/index.js
import _ from 'lodash'
import fs from 'fs'
import path from 'path'
import yaml from 'js-yaml'

class ConfigHandler {

  private static _instance : ConfigHandler
  private _config : any

  private _multiFile = false
  basePath = 'www/persistent'

  static get() {
    if (!this._instance) {
      this._instance = new ConfigHandler();
    }

    return this._instance.load()
  }

  load() {
    this._config = this.loadConfig()
    this._config = this.swapVariables(this._config)

    return this._config
  }
  
  loadConfigFile(file : string) {
    try {
      return yaml.load(fs.readFileSync(path.resolve(this.basePath, file), 'utf8'))
    } catch (e) {
      if (!/ENOENT:\s+no such file or directory/.test(e)) {
        console.log('Error Loading ' + file + ':', e)
        throw e
      }
    }
  }
  
  loadConfig () {
    if (fs.existsSync(path.resolve(this.basePath, 'config.yml'))) {
      return this.loadConfigFile('config.yml')
    } else {
      let templ : any = {}
      this._multiFile = true
      let files = fs.readdirSync(path.resolve(this.basePath, 'config'))
      for (let i = 0; i < files.length; i++) {
        if (files[i].endsWith('.yml')) {
          let keyName = files[i].substring(0, files[i].length - '.yml'.length)
          templ[keyName] = this.loadConfigFile('config/' + files[i])
        }
      }
      return templ
    }
  }
  
  substitute(file : string, p : string) {
    let success = false
    let replaced = p.replace(/\${([\w.-]+)}/g, function (match, term) {
      if (!success) {
        success = _.has(file, term)
      }
      return _.get(file, term) || match
    })
    return {success: success, replace: replaced}
  }
  
  transform(file : string, obj : any) {
    let changed = false
    let resultant = _.mapValues(obj, (p) => {
      if (_.isPlainObject(p)) {
        let transformed : any = this.transform(file, p)
        if (!changed && transformed.changed) {
          changed = true
        }
        return transformed.result
      }
      if (_.isString(p)) {
        let subbed = this.substitute(file, p)
        if (!changed && subbed.success) {
          changed = true
        }
        return subbed.replace
      }
      if (_.isArray(p)) {
        for (let i = 0; i < p.length; i++) {
          if (_.isString(p[i])) {
            p[i] = this.substitute(file, p[i]).replace
          }
        }
      }
      return p
    })
    return {changed: changed, result: resultant}
  }
  
  requireSettings(settings : string|string[]) {
    let erredSettings : any[] = []
    let settingArray = Array.isArray(settings) ? settings : [settings]
    
    settingArray.forEach((setting) => {
      if (!_.has(this._config, setting)) {
        erredSettings.push(setting)
      }
    })
  
    if (erredSettings.length > 1) {
      throw new Error('The following settings are required in config.yml: ' + erredSettings.join('; '))
    }
  
    if (erredSettings.length === 1) {
      throw new Error(erredSettings[0] + ' is required in config.yml')
    }
  }
  
  swapVariables(configFile : string) {
    let readAndSwap = (obj : any) => {
      let altered = false
      do {
        let temp = this.transform(obj, obj)
        obj = temp.result
        altered = temp.changed
      } while (altered)
      return obj
    }
  
    let file : any = this._multiFile ? _.mapValues(configFile, readAndSwap) : configFile
    file = _.merge(
      {},
      file || {},
      )
  
    file = readAndSwap(file)
    return file
  }
}

export default ConfigHandler.get();