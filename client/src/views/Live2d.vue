<template>
  <div>
    <canvas id="canvas" width="200" height="240"></canvas>
  </div>
</template>

<script>
import * as PIXI from 'pixi.js'
window.PIXI = PIXI
const { Live2DModel } = require('pixi-live2d-display')

export default {
  name: 'Live2d',
  components: {},
  data() {
    return {
      mouthOpen: true,
    }
  },
  mounted() {
    this.live2dInit()
    // setTimeout(() => {
    //   this.mouthOpen = false
    // }, 5000)
  },
  methods: {
    async live2dInit() {
      const PIXI = window.PIXI

      const app = new PIXI.Application({
        view: document.getElementById('canvas'),
        width: 400,
        height: 575,
        transparent: true,
      })

      const model = await Live2DModel.from(
        '/live2d/hiyori/hiyori_pro_t10.model3.json'
      )
      app.stage.addChild(model)

      // transforms
      console.log(model.width)
      const scaleX = 400 / model.width
      const scaleY = 575 / model.height

      // fit the window
      model.scale.set(Math.min(scaleX, scaleY))

      //   model.y = innerHeight * 0.1

      console.log(model)
      window.l2dmodel = model

      //   let mouthValue = 0
      app.ticker.add(() => {
        // model.internalModel.coreModel._model.parameters.values[4] = 0
        if (this.mouthOpen) {
          model.internalModel.coreModel.setParameterValueByIndex(
            19,
            Math.sin(performance.now() / 100) / 2 + 0.5
          )
        } else {
          model.internalModel.coreModel.setParameterValueByIndex(19, 0)
        }

        // console.log(model.internalModel.coreModel._model.parameters.values[19])
        // mimic the interpolation value, 0-1
        //   mouthValue = Math.sin(performance.now() / 100) / 2 + 0.5
        // model.internalModel.coreModel._model.parameters.keyValues[19][1] =
        //   Math.sin(performance.now() / 100) / 2 + 0.5
        // model.internalModel.coreModel._model.parameters.keyValues[19][0] =
        //   Math.sin(performance.now() / 100) / 2 + 0.5
      })
      //   const updateFn = model.internalModel.motionManager.update

      //   model.internalModel.motionManager.update = () => {
      //     // updateFn.call(model.internalModel.motionManager)
      //     //   // overwrite the parameter after calling original update function
      //     //   model.internalModel.coreModel.setParamFloat(
      //     //     'PARAM_MOUTH_OPEN_Y',
      //     //     mouthValue
      //     //   )
      //     // model.internalModel.coreModel._model.parameters.keyValues[19][1] = 5
      //     // model.internalModel.coreModel._model.parameters.keyValues[19][0] = 5
      //   }

      // interaction
      //   model.on('hit', (hitAreas) => {
      //     if (hitAreas.includes('body')) {
      //       model.motion('tap_body')
      //     }
      //   })

      console.log(Live2DModel)

      //   const cubism2Model =
      //     'https://cdn.jsdelivr.net/gh/guansss/pixi-live2d-display/test/assets/shizuku/shizuku.model.json'
      //   const cubism4Model = '/live2d/hiyori/hiyori_pro_t10.model3.json'
      //   //   const PIXI = window.PIXI

      //   const app = new PIXI.Application({
      //     view: document.getElementById('canvas'),
      //     autoStart: true,
      //     resizeTo: window,
      //   })

      //   const models = await Promise.all([
      //     Live2DModel.from(cubism2Model),
      //     Live2DModel.from(cubism4Model),
      //   ])

      //   models.forEach((model) => {
      //     app.stage.addChild(model)

      //     const scaleX = (innerWidth * 0.4) / model.width
      //     const scaleY = (innerHeight * 0.8) / model.height

      //     // fit the window
      //     model.scale.set(Math.min(scaleX, scaleY))

      //     model.y = innerHeight * 0.1
      //   })

      //   const model2 = models[0]
      //   const model4 = models[1]

      //   model2.x = (innerWidth - model2.width - model4.width) / 2
      //   model4.x = model2.x + model2.width
    },
  },
}
</script>

<style></style>
