<template>
  <div class="App">
    <header class="App_Header">
      <div class="container">
        <h2 class="h1">Skills & References</h2>
        <a class="logo" href="/">
          <h1>
            <span class="name">
              Sebastian<br />
              Müller
            </span>
            <span class="company">{spanPerCharacter('grizzly.web')}</span>
          </h1>
        </a>
      </div>
    </header>

      <div class="App_Main">
        <!-- <ExperienceOverview data={this.state.history} filter={this.state.filter} ></ExperienceOverview> -->
        <div class="Textarea">
          <h2>Imprint</h2>
          <p>
            grizzly.web (Sebastian Müller)<br />
            Ostwall 125<br />
            47798 Krefeld<br />
          </p>
          <p>
            Owner: Sebastian Müller<br />
            identification number: 942/0588/6738<br />
          </p>
        </div>
        <!--<IssueTracker isActive={this.state.isssueTrackerIsActive} onClose={this.handleFeedbackClick}></IssueTracker>-->
      </div>
      <!-- <Footer socialLinks={this.state.socialLinks} onFeedbackClick={this.handleFeedbackClick}></Footer> -->
      <footer class="App_Footer">
        <div class="container">
          <div class="social-links">
            <h4>you find me on</h4>
            {socialLinks}
          </div>
          <nav class="meta-nav">
            <h4>about this website</h4>
            <button this.props.onFeedbackClick>Feedback / Bug report</button>
            <a href="https://github.com/grizzlydotweb/grizzly-dot-web-career" target="_blank">Opensource (github.com)</a>
          </nav>
        </div>
      </footer>
  </div>
</template>

<script>

export default {
  name: 'app',
  components: {
  }
}
</script>

<style lang="scss">

</style>
