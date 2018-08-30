<template>
    <div id="about" class="grid-container">
        <div class="grid-x">
            <div class="cell">
                <h4>Contact us</h4>
                <pre>This program was an effort of several years of devlopment, testing, doing and redoing.
It was made with a lot of thought in order to make it the best it could be.
However, if this program has any problems for you in your competition,
or you have any suggestions or questions, please contact us by:
</pre>
                <div class="grid-x text-center grid-padding-y">
                    <div class="cell small-4">Emailing global head ref Alan Green: <a>alanggreen@gmail.com</a></div>
                    <div class="cell small-4"><a href="http://flltools.com">Visiting our website</a></div>
                    <div class="cell small-4"><a>Openning a Trello card</a><br/>(Trello is an app for task-managing forums)</div>
                </div>
                <pre>If you wish to report a bug, please click <a @click="saveLogs">here</a> to export the programs logs and send it with the email.
</pre>
                <h4>Credits</h4>
                <pre>A lot of people worked very hard to make sure this program will perform in the best manner.
Those people deserve our credit and deepest thanks.
The people which we're involved in the development of the program:

Jeroen Bosch, Rikkert Koppes, Sander Leemans, Kenny Meesters, Martin Poelstra, Rob van Wijk,
Dafner Dafner, Alan Green, Itamar Green, Yosi Karl, Barak Ohana, Roy Shmueli, Idan Stark, Tal Taub</pre>
            </div>
        </div>
    </div>
</template>

<script>
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
                message: 'Error in saving logs'
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
