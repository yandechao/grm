import { createApp,h, ref } from '@vue/runtime-dom'
import MenuTreeSolt from '@/components/MenuTreeSolt.vue'
import MenuTreePage from '@/components/MenuTreePage.vue'
import { ElTree,ElButton,ElRow,ElCol, ElDialog,ElInput,ElSelect,ElForm,ElOption } from 'element-plus'
import {getKeys} from '@/api/index.js'
import store from '@/store/index.js'


const genNode = function(id,dataS){
    const vdom = createApp({    
    setup() {
        const data = dataS
        return { data }
    },
    render() {
    
        return h(
            ElTree,
            {
                data:this.data,
            },
            {
                default: ({node,data})=>h(MenuTreeSolt,
                {
                    node,
                    data
                })
            }
        )
    }
    
    });
    
    const parent = document.getElementById(id)
    vdom.use(store).use(ElTree).use(ElButton).use(ElDialog).use(ElInput).use(ElOption).use(ElForm).use(ElSelect).mount(parent)
};


const genPage = function(id,match,next){
    const vdom = createApp({    
    setup() {
        let nextCursor = next
        return { nextCursor }
    },
    render() {
    
        return h(
            MenuTreePage,
            {
                next:this.nextCursor,
                index:id,
                match:match
            },
            {}
        )
    }
    
    });
    
    const parent = document.getElementById("page#"+id)
    vdom.use(store).use(ElRow).use(ElCol).use(ElButton).mount(parent)
};


const dbKeysList = (index,match,cursor)=>{
    getKeys({"index":index,"match":match,"cursor":cursor}).then((res) => {
        document.getElementById("menu#"+index).nextElementSibling.setAttribute("style","display:flex")
        genNode("tree#"+index,ref(res.data.data));
        if(res.data.cursor != 0){
            document.getElementById("page#"+index).style.display="block"
            genPage(index,match,res.data.cursor)
        }else{
            document.getElementById("page#"+index).style.display="none"
        }
        document.getElementById("dbnum#"+index).innerHTML = res.data.count;
    });
}

export {dbKeysList}