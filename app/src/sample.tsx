import React from "react";

class Clock extends React.Component {
  constructor(props: any) {
    super(props);
    this.state = { date: new Date() };
  }

  async componentDidMount() {
    try {
      const constraints = { video: true, audio: true };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      const videoElement = document.querySelector(
        "video#localVideo"
      ) as HTMLMediaElement;
      console.log(stream);
      videoElement.srcObject = stream;
    } catch (error) {
      console.error("Error opening video camera.", error);
    }
  }

  componentWillUnmount() {}

  render() {
    return (
      <div>
        <h1>Hello, world!</h1>
        <video id="localVideo" controls={false} />
      </div>
    );
  }
}

export default Clock;
