<template>
  <div id="about" class="ui container">
    <div class="ui one column padded grid">
      <div class="column">
        <div class="ui segment">
          <h1 class="ui header">Contact us</h1>
          <p>
              This software is the result of several years of development, testing, doing and redoing.
              A lot of thought and effort went into making it work well.
              However, if you encounter any problems at your competition,
              or you have any suggestions or questions, you can get support:
          </p>
          <div class="ui basic segment">
            <div class="ui three cards">
              <a class="link card" @click="event => openSite(event, 'mailto:FLL-TMS-Support@firstinspires.org')">
                <div class="content">
                  <div class="header">
                    <i class="envelope icon"></i> Support email
                  </div>
                  <div class="description">
                    FLL-TMS-Support@firstinspires.org
                  </div>
                </div>
              </a>
              <a class="link card" @click="event => openSite(event, 'http://fll-tools.com/support/')">
                <div class="content">
                  <div class="header">
                    <i class="globe icon"></i> Support website
                  </div>
                  <div class="description">
                    fll-tools.com/support
                  </div>
                </div>
              </a>
            </div>
          </div>
          <p>
            When reporting a bug, please click "Save debug data" to export the software logs and the
            team scores database. Attach the zip file to the email or support ticket.
          </p>
          <div class="ui center aligned basic segment">
            <a class="ui primary button" @click="saveDebugData"><i class="ui bug icon"></i>Save debug data</a>
          </div>
        </div>
      </div>
      <div class="column">
        <div class="ui segment">
          <h1 class="ui header">Credits</h1>
          <p>Many people took part in the development of this software. We appreciate the help of:</p>
          <div class="ui four cards">
            <div v-for="contributor in contributors" class="card">
              <div class="content">
                <div class="header">
                    {{contributor.name}}
                </div>
                <div class="meta">
                  <i :class="`${contributor.country.code.toLowerCase()} flag`"></i> {{contributor.country.name}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import Promise from 'bluebird'
  import iso3166 from 'iso-3166-2'

  import contributors from './contributors.json'

  export default {
    name: 'AboutPage',
    methods: {
      openSite (event, site) {
        event.preventDefault()

        Promise.fromCallback(cb => this.adapter.openSite(site, cb))
          .catch(err => {
            console.error(err)
          })
      },
      saveDebugData () {
        this.dialog.showSaveDialog({
          title: 'Save debug data',
          defaultPath: 'debug-data.zip',
          filter: [{ name: 'zip', extensions: ['zip'] }]
        }, filePath => {
          Promise.fromCallback(cb => this.adapter.saveDebugData(filePath, cb))
            .then(() => this.dialog.showMessageBox({
              type: 'info',
              buttons: ['Ok'],
              message: 'Debug data saved'
            }))
            .catch(err => {
              this.dialog.showMessageBox({
                type: 'error',
                buttons: ['Ok'],
                message: 'Error saving debug data'
              })
              console.error(err)
            })
        })
      }
    },
    data () {
      return {
        contributors: contributors.map(contributor => {
          return {
          name: contributor.name,
            country: iso3166.country(contributor.countryCode)
          }
        })
      }
    },
    mounted () {
      this.dialog = this.$electron.remote.dialog
      this.adapter = this.$electron.remote.require('./main').homeAdapter
    }
  }
</script>

<style scoped>
#about pre {
    font-family: inherit;
}
</style>
