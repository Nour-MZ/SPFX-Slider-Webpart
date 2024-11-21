import { Version } from '@microsoft/sp-core-library';
import {
  type IPropertyPaneConfiguration,
  PropertyPaneTextField,
  PropertyPaneSlider,
  PropertyPaneCheckbox,

  PropertyPaneDropdown,
  PropertyPaneToggle,
  PropertyPaneChoiceGroup

} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
// import { PropertyFieldListPicker } from '@pnp/spfx-property-controls/lib';


import { PropertyFieldColorPicker, PropertyFieldColorPickerStyle } from '@pnp/spfx-property-controls/lib/PropertyFieldColorPicker';
import Swiper, { Navigation, Pagination, EffectFade, EffectFlip, EffectCube, EffectCards, EffectCoverflow, Autoplay } from 'swiper';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/effect-fade';
import 'swiper/css/effect-flip';
import 'swiper/css/effect-cube';
import 'swiper/css/effect-coverflow';


import { spfi, SPFx } from '@pnp/sp';
import { ICamlQuery } from "@pnp/sp/lists";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/fields/list";
import "@pnp/sp/files";
import "@pnp/sp/folders";
import "./style.css"

import clockIconUrl from './assets/icon.svg'

const slideEffects = [
  { key: 'slide', text: 'Slide' },
  { key: 'fade', text: 'Fade' },
  { key: 'cube', text: 'Cube' },
  { key: 'cards', text: 'Cards' },
  { key: 'coverflow', text: 'Coverflow' },

];

Swiper.use([Navigation, Pagination, EffectFade, EffectFlip, EffectCube, EffectCards, EffectCoverflow, Autoplay, Pagination]);


export interface IListItem {
  name: string;
  title: string;
  paragraph: string;
  tags: any;
}

export interface ISliderWebPartProps {
  listname: string;

  itemnumber: number;
  lists: string | string[];
  template: 'slider1' | 'slider2' | 'slider3';
  carouselheight: number;
  slidereffect: 'slide' | 'fade' | 'cube' | 'coverflow' | 'cards';
  autotransitiondelay: number;
  animationspeed: number;
  autoplay: boolean;
  headerfont: number;
  headerspacing: number;
  headercolor: string;
  descriptionfont: number;
  descriptioncolor: string;
  tagstoggle: boolean;
  backgroundcolor: string;
  thumbnailtoggle: boolean;

}


let sp: ReturnType<typeof spfi>;
export default class SliderWebPart extends BaseClientSideWebPart<ISliderWebPartProps> {




  public async render(): Promise<void> {
    const listName = this.properties.listname;
    const listItems = await this.getListItems(listName, this.properties.itemnumber);
    console.log(listItems)
    const uniqueClassSuffix = `slider-${this.context.instanceId}`;
    // const clockIconUrl = require('./assets/Icon feather-clock.svg');

    if (this.properties.template === 'slider3') {
      const cardsHtml = listItems.map((item, index) => `
    <div class="elcustom slider3 card">
        <div class="elcustom-image-container" style="display: ${this.properties.thumbnailtoggle === true ? 'flex' : 'none'}">
            <img src="https://wshare.sharepoint.com/sites/SliderWebpart/${listName}/${item.name}" alt="${item.title}">
        </div>
        <div class="elcustom-content" style="background-color: ${this.properties.backgroundcolor}">
            <h1 style="color: ${this.properties.headercolor}; font-size: ${this.properties.headerfont}px;">
                ${item.title}
            </h1>
            <p class="elcustom-paragraph" style="color: ${this.properties.descriptioncolor}; font-size: ${this.properties.descriptionfont}px;">
                ${item.paragraph}
            </p>
            <div class="elcustom-tags"  style="display: ${this.properties.tagstoggle === true ? 'flex' : 'none'}">
                <div class="elcustom-tags-clock">
                    <img src="${clockIconUrl}" alt="Clock Icon">
                    <span class="elcustom-time">6 hours ago</span>
                </div>
                ${item.tags.slice(0, 3).map((tag :any) => `<span class="elcustom-tag">${tag}</span>`).join('')}
            </div>
        </div>
    </div>
`).join('');

this.domElement.innerHTML = `
    <div class="elcustom-slider-container ${uniqueClassSuffix} ${this.properties.template}">
        ${cardsHtml}
    </div>
`;

    }

    else {




      const slidesHtml = listItems.map((item, index) => `
      <div class="swiper-slide" style="background-color: ${this.properties.backgroundcolor};">
          <div class="elcustom-image-container" >
              <img src="https://wshare.sharepoint.com/sites/SliderWebpart/${listName}/${item.name}" alt="${item.title}">
          </div>
          <div class="elcustom-content swiper-no-swiping" style="background-color:${this.properties.backgroundcolor};">
              <h1 class="elcustom-extra-title ${uniqueClassSuffix}" style="color: ${this.properties.headercolor}; letter-spacing: ${this.properties.headerspacing}px; font-size: ${this.properties.headerfont}px;">${item.title}</h1>
              <div class="elcustom-tags" style="display: ${this.properties.tagstoggle === true ? 'flex' : 'none'}">
                  <div class="elcustom-tags-line"></div>
                  ${item.tags.slice(0, 3).map((tag: any) => `<span class="elcustom-tag">${tag}</span>`).join('')}
              </div>
              <p class="elcustom-paragraph" style="color: ${this.properties.descriptioncolor}; font-size: ${this.properties.descriptionfont}px;">${item.paragraph}</p>
          </div>
          <div class="swiper-button-prev elcustom-swiper-button elcustom-prev ${uniqueClassSuffix}"></div>
          <div class="swiper-button-next elcustom-swiper-button ${uniqueClassSuffix}"></div>
      </div>
  `).join('');

      this.domElement.innerHTML = `
      <div class="elcustom-slider-container ${uniqueClassSuffix} ${this.properties.template}">
          <div class="swiper elcustom-slider ${uniqueClassSuffix}">
              <div class="swiper-wrapper">
                  ${slidesHtml}
              </div>
              <div class="swiper-pagination ${uniqueClassSuffix}"></div>
              <div class="swiper-button-next elcustom-swiper-button ${uniqueClassSuffix}"></div>
              <div class="swiper-button-prev elcustom-swiper-button ${uniqueClassSuffix}"></div>
          </div>
      </div>
    `;

      const swiper = new Swiper(`.${uniqueClassSuffix} .swiper`, {
        loop: true,
        effect: this.properties.slidereffect,
        slidesPerView: 1,
        pagination: {
          el: ``,
          clickable: true,
          // type: this.properties.paginationstyle,
          dynamicBullets: true,
          dynamicMainBullets: 3

        },

        speed: this.properties.animationspeed,
        autoplay: this.properties.autoplay ? { delay: this.properties.autotransitiondelay } : false,
        // direction: this.properties.template === 'banner4' ? "vertical" : 'horizontal',
        navigation: {
          nextEl: `.${uniqueClassSuffix} .swiper-button-next`,
          prevEl: `.${uniqueClassSuffix} .swiper-button-prev`,
        },
      });


      console.log(swiper);
    }
  }

  protected onInit(): Promise<void> {
    sp = spfi().using(SPFx(this.context));
    const style = document.createElement('style');
    style.type = 'text/css';

    style.innerHTML = `
    #spPropertyPaneContainer [class = '${this.context.instanceId}'] .ms-ChoiceField--image {
       width: calc(50% - 4px);
    }

    #spPropertyPaneContainer [class = '${this.context.instanceId}'] .ms-ChoiceField--image .ms-ChoiceField-labelWrapper{
          margin: 0;
    background: transparent;
    width: 100% !important;
    padding: 0;
    max-width: none;
    width: 80% !important;
    }

    #spPropertyPaneContainer [class = '${this.context.instanceId}'] .ms-ChoiceField--image .ms-ChoiceField-field{
      // padding: 0;
    }
    `;
    document.head.appendChild(style);
    return Promise.resolve();
  }



  private async getListItems(listName: string, itemsnumber: number): Promise<IListItem[]> {
    try {
      console.log(listName)
      console.log(itemsnumber)
      const caml: ICamlQuery = {
        ViewXml: `<View><RowLimit>${itemsnumber}</RowLimit></View>`,
      };
      const items = await sp.web.lists.getByTitle(listName).getItemsByCAMLQuery(caml);
      console.log(items)
      return items.map((item: any) => ({
        title: item.test,
        paragraph: item.description,
        name: item.title0,
        tags: item.tagser
      }));
    } catch (error) {
      console.error(`Error fetching list items: ${error}`);
      return [];
    }
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {

          displayGroupsAsAccordion: true,
          header: {
            description: "Configure How you want to display the banner activities"
          },
          groups: [
            {
              groupName: "General Configuration",
              isCollapsed: true,
              groupFields: [
                PropertyPaneTextField('listname', {
                  label: "List Name"
                }),

                PropertyPaneSlider('itemnumber', {
                  label: "Slider Value",
                  min: 0,
                  max: 30,
                }),
                PropertyPaneCheckbox('listName', {
                  text: "Hide this web part if there is nothing to show"
                }),
              ]
            },
            {
              groupName: "Template",
              isCollapsed: true,
              groupFields: [
                PropertyPaneChoiceGroup('template', {
                  label: "Layout", // don't forget to localize your test in a real-world solution
                  options: [
                    {
                      key: 'slider2',
                      text: 'Template 1',
                      selectedImageSrc: require('./assets/1.svg'),
                      imageSrc: require('./assets/1.svg'),
                      imageSize: {
                        width: 100,
                        height: 100,
                      },

                    },
                    {
                      key: 'slider1',
                      text: 'Template 2',
                      selectedImageSrc: require('./assets/2.svg'),
                      imageSrc: require('./assets/2.svg'),
                      imageSize: {
                        width: 100,
                        height: 100,
                      },

                    },
                    {
                      key: 'slider3',
                      text: 'Template 3',
                      selectedImageSrc: require('./assets/3.svg'),
                      imageSrc: require('./assets/3.svg'),
                      imageSize: {
                        width: 100,
                        height: 100,
                      },

                    },



                  ]
                }),
              ]
            },
            {
              groupName: "Template Configuration",
              isCollapsed: true,
              groupFields: [
                PropertyPaneToggle('tagstoggle', {
                  label: "Tags",
                  

                }),
                PropertyPaneToggle('thumbnailtoggle', {
                  label: "Thumbnail",
                  disabled: this.properties.template === 'slider3'? false: true,
                }),
                PropertyFieldColorPicker('backgroundcolor', {
                  label: 'Background Color',
                  selectedColor: this.properties.backgroundcolor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  debounce: 100,
                  isHidden: false,
                  alphaSliderHidden: true,
                  showPreview: true,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: '',
                  key: 'colorFieldId'
                }),

              ]
            },

            {
              groupName: "Animation",
              isCollapsed: true,
              groupFields: [
                PropertyPaneDropdown('slidereffect', {
                  label: 'Select Slide Effect',
                  options: slideEffects,
                  selectedKey: slideEffects[0].key
                }),

                PropertyPaneSlider('animationspeed', {
                  label: "Transition Speed Milliseconds",
                  min: 0,
                  max: 10000,

                }),

                PropertyPaneToggle('autoplay', {
                  label: "AutoPlay On/Off",

                }),
                PropertyPaneSlider('autotransitiondelay', {
                  label: "Milliseconds between each change of news post",
                  min: 0,
                  max: 10000,
                  disabled: this.properties.autoplay === true ? false : true
                }),

              ]
            },
            {
              groupName: "Header Style",
              isCollapsed: true,
              groupFields: [
                PropertyPaneSlider('headerfont', {
                  label: "Font Size",
                  min: 0,
                  max: 100,
                }),
                PropertyPaneSlider('headerspacing', {
                  label: "Title Letter Spacing",
                  min: 0,
                  max: 30,
                }),
                PropertyFieldColorPicker('headercolor', {
                  label: 'Color',
                  selectedColor: this.properties.headercolor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  debounce: 100,
                  isHidden: false,
                  alphaSliderHidden: true,
                  showPreview: true,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: '',
                  key: 'colorFieldId'
                })

              ]
            },

            {
              groupName: "Description Style",
              isCollapsed: true,
              groupFields: [
                PropertyPaneSlider('descriptionfont', {
                  label: "Font Size",
                  min: 0,
                  max: 100,
                }),

                PropertyFieldColorPicker('descriptioncolor', {
                  label: 'Color',
                  selectedColor: this.properties.descriptioncolor,
                  onPropertyChange: this.onPropertyPaneFieldChanged,
                  properties: this.properties,
                  disabled: false,
                  debounce: 100,
                  isHidden: false,
                  alphaSliderHidden: true,
                  showPreview: true,
                  style: PropertyFieldColorPickerStyle.Inline,
                  iconName: '',
                  key: 'colorFieldId'
                })

              ]
            },
          ]
        }
      ]
    };
  }
}