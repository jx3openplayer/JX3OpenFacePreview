<script lang="ts" setup>
import { NCard, NFlex, NA, NBlockquote, NText, NH1, NH2 } from 'naive-ui'
</script>

<template>
  <n-flex justify="center">
    <n-card class="about">
      <n-h1 prefix="bar">
        <n-text type="primary">
          声明
        </n-text>
      </n-h1>
      鉴于在剑网3的捏脸市场中，频繁出现货不对板的情况，并且部分捏脸存在缺陷但店家拒绝承担责任的现象，我们感到有必要为玩家权益发声。因此，我们创立了本项目，旨在为玩家提供一个安全、可靠的平台，让玩家可以免费预览、尝试各类捏脸作品，直到确定满意后再考虑是否付费支持原作者。
      <br /> <br />
      我们深知玩家在购买虚拟物品时所面临的风险，因此我们致力于公开展示捏脸作品的真实面貌，避免玩家因购买“霸王条款”所带来的损失。我们将坚守诚信原则，为玩家提供公正、透明的服务，希望玩家们在我们的平台上能够找到最合适的捏脸作品，享受游戏的乐趣。
      <br /> <br />
      如想要为此贡献新的脸型，可以访问<n-a href="https://f.wps.cn/g/P95JDjCH/">上传</n-a>填写表单。
      <br /> <br />
      <n-blockquote>
        本项目仅为捏脸作品的预览和体验平台，如果您决定实际使用某款捏脸作品，请务必支持原作者购买正版。感谢您对我们项目的关注和支持！
        本项目为开源项目，不会要求任何付费与赞助。如有意见与建议，可前往<n-a
          href="https://github.com/jx3openplayer/JX3OpenFacePreview">jx3openplayer/JX3OpenFacePreview</n-a>反馈！
      </n-blockquote>
    </n-card>
  </n-flex>

</template>

<style>
@media (min-width: 512px) {
  .about {
    min-height: 10vh;
    max-width: 50vh;
    margin-top: 50px;
  }
}
</style>
