import React from 'react';
import './search.css';
import AOS from 'aos';
import 'aos/dist/aos.css';
// import { search } from '@core/utils/api/api';
import { searchInference } from '@core/utils/api/api';
import { Space40, Space60, Space120 } from '@core/components/atom/space/space';
// import { formatString } from '@core/utils/modules/modules';
import { Spinner } from 'react-bootstrap';
export default class Inference extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: '',
      number: 4,
      data: [],
      percent: 0,
      tracking: false,
      isSearch: false,
      disable: true,
      error: false,
    };
  }

  componentDidMount() {
    AOS.init({
      once: true
    });
    document.title = 'InfoCheck | Inference';
  }

  render() {
    const { text, data, isSearch, error } = this.state;

    // const resultSearch = (data) => {
    //   console.log(data);
    //   if (data.answer.length === 0) {
    //     return (
    //       <div></div>
    //     );
    //   }
    //   else if (data.length > 0) {
    //     return (

    //     );
    //   }
    //   return 0;
    // };

    // const listItem = (data) => {
    //   if (data.length === 0) {
    //     return (
    //       <div className='no_result'>
    //         <p className='highlight-color'>No have result, please start your search!</p>
    //       </div>
    //     );
    //   } else if (data.length > 0) {
    //     const map = data[1].map((item, index) => (
    //       <div key={index} className='box-card'>
    //         <div className='box-card__content'>
    //           <h3 className='highlight-color'>
    //             Interpretation {index + 1}
    //           </h3>
    //           <p> <span className='txt-title-card-result'> Title: {item['title']} </span>
    //           </p>
    //           <p style={{ marginTop: '8px' }}>
    //             <span className='txt-time-search'>Time: {item['publish_time']}</span>
    //           </p>
    //           <p>Description: {formatString(item['description'])}</p>
    //           <div className='content__btn-link'>
    //             <a className='btn-link--modifile' href={`${item['link']}`}>Read more</a>
    //           </div>
    //         </div>
    //       </div>
    //     ));
    //     return map;
    //   }
    //   return 0;
    // };

    return (
      <div>
        <div
          data-aos='fade-up'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          className='search__title'>
          <div className='title__layout'>
            <h1 className='highlight-color'>Inference</h1>
            <h3 className='layout__sub-title'> Computational Fact Checking
            </h3>
          </div>
        </div>
        <div
          data-aos='fade-up'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          className='search__description'>
        </div>
        <Space40></Space40>
        <div
          data-aos='fade-right'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          data-aos-delay='600'
          className='search'>
          <div className='search__layout'>
            <input
              className='input-search'
              id='input-search'
              placeholder='Enter a sentence here'
              onChange={async (event) => {
                await this.setState({ text: event.target.value });
                if (text.length > 0) {
                  await this.setState({ disable: false });
                } else {
                  this.setState({ disable: true });
                }
              }}
            />
            <button
              className='btn-search'
              // disabled={disable}
              onClick={async () => {

                if (text.length === 0) {
                  this.setState({ error: true });
                  return;
                }
                this.setState({ isSearch: true });
                let bodyFormData = new FormData();
                bodyFormData.append('data', text);
                const res = await searchInference(bodyFormData);
                console.log(res);
                if (!res.data.data.length) {
                  this.setState({ error: true });
                  this.setState({ isSearch: false });
                  return;
                }
                await this.setState({ data: res.data.data });
                await this.setState({ isSearch: false });
                await this.setState({ disable: true });
                // await this.setState({ text: '' });
                document.getElementById('input-search').value = '';
                // await search(text, number).then(async res => {
                //   if(!res) {
                //     this.setState({ error: true });
                //     this.setState({ isSearch: false });
                //     return;
                //   }
                //   await this.setState({ data: res});
                //   await this.setState({ isSearch: false });
                //   await this.setState({ disable: true });
                //   await this.setState({ text: '' });
                //   document.getElementById('input-search').value = '';
                // });
              }}
            >
              <div className='btn-search__layout'>
                <div className='txt-search'>Checking</div>
                {isSearch ?
                  <Spinner animation='border' role='status' size='sm' variant='light' className='spinner-custom'>
                    <span className='visually-hidden'>Loading...</span>
                  </Spinner>
                  :
                  <div></div>
                }
              </div>
            </button>
          </div>
          {text && <><div ><b>Your sentence : </b> {text}</div> <div style={{ marginTop: '16px' }}></div></>}
          {error ? <div className='search__error'><i className='bx bx-error'></i> Request server error. Please try again!</div> : <div style={{ marginTop: '16px' }}></div>}
          {data.length > 0 && <><p><b>Number of result: {data.length}</b></p>
            <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", width: "30%", fontWeight: "bold" }}><div>support : {data.filter(item => item.label == 'support').length}</div><div>refuse: {data.filter(item => item.label == 'refuse').length}</div><div>neutral: {data.filter(item => item.label == 'neutral').length}</div></div></>}
        </div>
        {data.length > 0 && data.map(item => (<div className='search__result' key={item.sent_id}>

          <div className='result'>
            <h5>Evidence: <span style={{ fontWeight: "lighter" }}>{item.evidence}</span></h5>
            <p ><span style={{ fontWeight: "bold" }}>Label:</span> <span className={item.label} style={{ fontWeight: "bold" }}>{item.label}</span></p>
            <p>
              <span style={{ fontWeight: "bold" }}>Inference score:</span> {item.inference_score}
            </p>
            <div> <span style={{ fontWeight: "bold" }}>Context : </span> <span dangerouslySetInnerHTML={{ __html: item.context.content.replace(item.evidence, `<b>${item.evidence}</b>`) }}>
            </span></div>
          </div>
        </div>))}
        <Space60></Space60>
        <div
          data-aos='fade-up'
          data-aos-easing='ease-in-sine'
          data-aos-duration='600'
          data-aos-delay='1200'
          className='title-result'>
          <h5 className='txt-result'>
            Fact Checking your sentence
          </h5>
          <Space40></Space40>
          {/* <div className='layout-card'>{listItem(data)}</div> */}
        </div>
        <Space120></Space120>
      </div>
    );
  }
}
