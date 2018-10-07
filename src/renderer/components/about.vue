<template>
    <div id="about" class="grid-container">
        <div class="grid-x">
            <div class="cell">
                <h4>Contact us</h4>
                <pre>This software is the result of several years of development, testing, doing and redoing.
A lot of thought and effort went into making it work well.
However, if you encounter any problems at your competition,
or you have any suggestions or questions, please contact us by:
</pre>
                <div class="grid-x text-center grid-padding-y">
                    <div class="cell small-4">Emailing Alan Green: agreen@firstinspires.org</div>
                    <div class="cell small-4"><a href="http://fll-tools.com/support/">Visiting our website Support Page</a></div>
                </div>
                <pre>When reporting a bug, please click "Save Logs" to export the software logs and attach them to the email or support ticket. <a @click="saveLogs">Save Logs</a>
</pre>
                <h4>Credits</h4>
                <pre>Many people took part in the development of this software. We appreciate the help of:

Jeroen Bosch, Rikkert Koppes, Sander Leemans, Kenny Meesters, Martin Poelstra, Rob van Wijk,
Dafner Dafner, Yonatan Gideoni, Alan Green, Itamar Green, Yosi Karl, Barak Ohana, Roy Shmueli, Idan Stark, Tal Taub</pre>
            </div>
        </div>
    </div>
</template>

<script>
  import Promise from 'bluebird'
  
  export default {
    name: 'AboutPage',
    methods: {
      saveLogs () {
        this.dialog.showSaveDialog({
          title: 'Save logs',
          defaultPath: 'logs.zip',
          filter: [{ name: 'zip', extensions: ['zip'] }]
        }, filePath => {
          Promise.fromCallback(cb => this.adapter.saveLogs(filePath, cb))
            .then(() => this.dialog.showMessageBox({
              type: 'info',
              buttons: ['Ok'],
              message: 'Logs saved'
            }))
            .catch(err => {
              this.dialog.showMessageBox({
                type: 'error',
                buttons: ['Ok'],
                message: 'Error saving logs'
              })
              console.error(err)
            })
        })
      }
    },
    mounted () {
      this.dialog = this.$electron.remote.dialog
    }
  }
</script>

<style scoped>
#about pre {
    font-family: inherit;
}
</style>
