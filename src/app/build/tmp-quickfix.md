## 修复_this.view._component.measureInWindow的问题

[https://stackoverflow.com/questions/60944091/taskqueue-error-with-task-undefined-is-not-an-object-evaluating-this-view](https://stackoverflow.com/questions/60944091/taskqueue-error-with-task-undefined-is-not-an-object-evaluating-this-view)

Go to the dir YOUR_PROJECT_PATH/node_modules/react-native-safe-area-view/index.js and update:

from:

```javascript
this.view._component.measureInWindow((winX, winY, winWidth, winHeight) => {
```

to:

```javascript
this.view.getNode().measureInWindow((winX, winY, winWidth, winHeight) => {
```
