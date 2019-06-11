import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import ReactPlayer from "react-player";

import {
  Accordion,
  AccordionItem,
  AccordionItemTitle,
  AccordionItemBody
} from "react-accessible-accordion";

// Demo styles, see 'Styles' section below for some notes on use.
import "react-accessible-accordion/dist/fancy-example.css";

class App extends Component {
  state = {
    list: [
      {
        id: 0,
        url:
          "https://bitdash-a.akamaihd.net/content/MI201109210084_1/m3u8s/f08e80da-bf1d-4e3d-8899-f0f6155f6efa.m3u8"
      },
      {
        id: 1,
        url: "https://bitdash-a.akamaihd.net/content/sintel/hls/playlist.m3u8"
      },
      {
        id: 2,
        url:
          "https://bitmovin-a.akamaihd.net/content/playhouse-vr/m3u8s/105560.m3u8"
      }
      // "http://192.168.207.24:8880/hls/test/index.m3u8"
    ],

    output_list: [
      {
        id: 0,
        url: undefined
      },
      {
        id: 1,
        url: undefined
      },
      {
        id: 2,
        url: undefined
      },
      {
        id: 3,
        url: undefined
      },
      {
        id: 4,
        url: undefined
      }
    ],
    dragging: undefined,
    from: undefined,
    input_local: [],
    output_local: []
    //json_test:[]
  };

  // componentWillMount(){
  //   this.getItems()
  // }
  // getItems(){
  //   fetch('http://kaishacse.000webhostapp.com/video.php')
  //   .then(results=>results.json())
  //   .then(results => this.setState({json_test:results.Responsvalue}))
  // }

  dragStart = ev => {
    this.dragged = Number(ev.currentTarget.dataset.id);
    ev.dataTransfer.effectAllowed = "copy";
    ev.dataTransfer.setData("text/html", null);
  };

  dragOver = ev => {
    ev.preventDefault();
  };

  dragEnd = ev => {
    ev.preventDefault();
    //console.log("dragEnd");
    const over = ev.currentTarget;
    const dragging = this.state.dragging;
    const from = isFinite(dragging) ? dragging : this.dragged;
    let to = Number(over.dataset.id);
    this.updateList(to, from);
  };

  get_index = () => {
    this.state.input_list.map((item, i) => {
      console.log("index", i);
      return item;
    });
  };

  sort = (input_list, output_list) => {
    for (let i = 0; i < input_list.length; i++) {
      for (let j = i + 1; j < input_list.length; j++) {
        if (input_list[i].id === input_list[j].id && i + 1 !== j) {
          let temp_id = input_list[i + 1].id;
          let temp_url = input_list[i + 1].url;
          input_list[i + 1].id = input_list[j].id;
          input_list[i + 1].url = input_list[j].url;

          let out_temp_id = output_list[i + 1].id;
          let out_temp_url = output_list[i + 1].url;
          output_list[i + 1].id = output_list[j].id;
          output_list[i + 1].url = output_list[j].url;

          for (let k = i + 3; k <= j; k++) {
            input_list[k].id = input_list[k - 1].id;
            input_list[k].url = input_list[k - 1].url;

            output_list[k].id = output_list[k - 1].id;
            output_list[k].url = output_list[k - 1].url;
          }
          input_list[i + 2].id = temp_id;
          input_list[i + 2].url = temp_url;

          output_list[i + 2].id = out_temp_id;
          output_list[i + 2].url = out_temp_url;
        }
      }
    }
  };

  updateList = (to, from) => {
    const state = this.state;
    const { list, output_list, output_local, input_local } = state;
    let input_obj = {};
    let output_obj = {};
    //console.log(to, from);

    if (output_list[to].url === undefined) {
      if (list[from].url === undefined) {
        //console.log(input_local[from].url);
        output_list[to].id = to;
        output_list[to].url = input_local[from].url;
        output_obj.id = to;
        output_obj.url = input_local[from].url;
        input_obj.id = from;
      } else {
        output_list[to].id = to;
        output_list[to].url = list[from].url;

        output_obj.id = to;
        output_obj.url = list[from].url;

        input_obj.id = from;
        input_obj.url = list[from].url;

        list[from].url = undefined;
      }
      input_local.push(input_obj);
      output_local.push(output_obj);

      this.sort(input_local, output_local);
    } else {
      alert("This slot is already occupied");
    }
    this.setState({ state });
  };

  handleClick = id => {
    const state = this.state;
    const { list, output_list, output_local, input_local } = state;
    let num_item = 0;
    var index = output_local.indexOf(output_local[id]);
    let last_index = undefined;

    output_local.map((item, i) => {
      if (output_local[id].url === output_local[i].url) {
        num_item++;
        last_index = i;
      }
    });
    console.log(output_local[id].id);
    //console.log(last_index);
    // console.log(num_item)
    let x = output_local[id].id;

    if (num_item > 1) {
      if (index > -1) {
        output_local.splice(index, 1);
        input_local.splice(last_index, 1);
        output_list[x].url = undefined;
      }
    } else {
      output_local.splice(index, 1);
      //console.log(input_local[index].id);
      //console.log(input_local[index].url)
      list[input_local[index].id].url = input_local[index].url;
      input_local.splice(index, 1);
      output_list[x].url = undefined;
    }

    //console.log(num_item);
    //console.log(output_local);
    this.setState({ state });
  };

  render() {
    const { list, output_list, input_local, output_local } = this.state;
    //console.log(input_local);
    //console.log(list)
    console.log(output_local);
    console.log(output_list);
    //console.log(this.state.json_test)
    return (
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-6 drag-margin-bottom_5">
            <div className={"col-lg-1 col-centered drag-margin-top-10"}>
              Preview:
            </div>
            {input_local.map((item, i) => {
              const dragging = i == this.state.dragging ? "dragging" : "";
              if (item != undefined) {
                return (
                  <div
                    className={"drag-div"}
                    data-id={i}
                    key={i}
                    draggable="true"
                    onDragStart={this.dragStart}
                  >
                    <ReactPlayer
                      url={item.url}
                      width="100%"
                      height="200px"
                      controls
                    />

                    {item.url !== undefined && (
                      <Accordion>
                        <AccordionItem>
                          <AccordionItemTitle>
                            <h4 class="u-position-relative h-4">
                              Cam {item.id + 1}
                              <div
                                class="accordion__arrow "
                                role="presentation"
                              />
                            </h4>
                          </AccordionItemTitle>
                          <AccordionItemBody>
                            <p>Accessible Accordion component for React.</p>
                          </AccordionItemBody>
                        </AccordionItem>
                      </Accordion>
                    )}
                  </div>
                );
              }
            })}
          </div>
          <div className={"col-sm-6"}>
            <div className={"col-lg-1 col-centered drag-margin-top-10"}>OutPut:</div>
            {output_local.map((item, i) => {
              if (item != undefined) {
                return (
                  <div
                    className={"drag-div2"}
                    data-id={i}
                    key={i}
                    onDragOver={this.dragOver}
                    onDrop={this.dragEnd}
                  >
                    <ReactPlayer
                      url={item.url}
                      width="100%"
                      height="200px"
                      controls
                    />
                    <div className={"row"}>
                      <button
                        className={
                          "drag-button btn btn-danger btn-sm text-capitalize "
                        }
                        onClick={() => this.handleClick(i)}
                      >
                        release
                      </button>
                      <div className="output-div-2">
                        <Accordion>
                          <AccordionItem>
                            <AccordionItemTitle>
                              <h4 class="u-position-relative h-4">
                                Out {item.id + 1}
                                <div
                                  class="accordion__arrow "
                                  role="presentation"
                                />
                              </h4>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                              <p>Accessible Accordion component for React.</p>
                            </AccordionItemBody>
                          </AccordionItem>
                        </Accordion>
                      </div>
                      {/* <div className={"button"}>Out {item.id + 1} </div> */}
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>

        <div className="row">
          <div className="col-sm-6 drag-input-div">
            {list.map((item, i) => {
              const dragging = i === this.state.dragging ? "dragging" : "";
              if (item.url !== undefined) {
                return (
                  <div
                    className={"drag-div"}
                    data-id={i}
                    key={i}
                    draggable="true"
                    onDragStart={this.dragStart}
                  >
                    <ReactPlayer
                      url={item.url}
                      width="100%"
                      height="200px"
                      controls
                    />
                    <Accordion>
                      <AccordionItem>
                        <AccordionItemTitle>
                          <h4 class="u-position-relative h-4">
                            Cam {item.id + 1}
                            <div
                              class="accordion__arrow "
                              role="presentation"
                            />
                          </h4>
                        </AccordionItemTitle>
                        <AccordionItemBody>
                          <p>Accessible Accordion component for React.</p>
                        </AccordionItemBody>
                      </AccordionItem>
                    </Accordion>
                  </div>
                );
              }
            })}
          </div>
          <div className={"col-sm-6 drag-output-div"}>
            {output_list.map((item, i) => {
              if (item.url === undefined) {
                return (
                  <div
                    className={"drag-div1"}
                    data-id={i}
                    key={i}
                    onDragOver={this.dragOver}
                    onDrop={this.dragEnd}
                  >
                    <ReactPlayer
                      url={item.url}
                      width="100%"
                      height="200px"
                      controls
                    />
                    <div className={"row"}>
                      <div className="output-div-2">
                        <Accordion>
                          <AccordionItem>
                            <AccordionItemTitle>
                              <h4 class="u-position-relative h-4">
                                Out {item.id + 1}
                                <div
                                  class="accordion__arrow "
                                  role="presentation"
                                />
                              </h4>
                            </AccordionItemTitle>
                            <AccordionItemBody>
                              <p>Accessible Accordion component for React.</p>
                            </AccordionItemBody>
                          </AccordionItem>
                        </Accordion>
                      </div>
                    </div>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    );
  }
}

export default App;
