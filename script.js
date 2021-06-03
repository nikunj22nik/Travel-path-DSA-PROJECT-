onload=function(){

let curr_data,V,src,dest;

const mynetwork=document.getElementById("network");
const mynetwork2=document.getElementById("mynetwork2");
const gengraph=document.getElementById("gen_graph");
const solve=document.getElementById("solve");
const questiontxt=document.getElementById("questiontxt");
const infotxt=document.getElementById("infotxt");
const cities = ['Delhi', 'Mumbai', 'Lucknow',  'Patna', 'Chennai','Mohali','Jaipur','Bhopal','Haridwar','Shimla','Srinagar'];
const distancemeter=document.getElementById("distancemeter");

//intialize graph opions

const options={
    edges:{
        labelHighlightBold: true,
        font: {
            size: 20
        }
    },
    nodes:{
        font: '12px arial red',
            scaling: {
                label: true
            },
            shape: 'icon',
            icon: {
                face: 'FontAwesome',
                code: '\uf015',
                size: 40,
                color: '#991133',
            }
      }

    }

    const network = new vis.Network(mynetwork);
    network.setOptions(options);
    // Network for result graph
    const network2 = new vis.Network(mynetwork2);
    network2.setOptions(options);


    function createData(){
       V=Math.floor(Math.random()*cities.length);
       if(V<5){
           V=6;
       }
 
       let nodes=[];

       for(let i=1;i<=V;i++){
           nodes.push({id:i,label:cities[i-1]})
       }
     nodes=new vis.DataSet(nodes);
       let edges=[];
       for(let i=2;i<=V;i++){
           let neigh=i-Math.floor((Math.random()*Math.min(i-2,4)+1));
      
       edges.push({type:0,from:i,to:neigh,color:"orange",label:String(Math.floor(Math.random()*70)+31)});
       
    }
    //Randmoly adding new edge in a graph
    //type-0 bus
    //type-1 plane


    for(let i=1;i<=V/2;){
        let n1=Math.floor(Math.random()*V)+1;
        let n2=Math.floor(Math.random()*V)+1;
        if(n1 !==n2){
            if(n1<n2){
                let tmp = n1;
                n1 = n2;
                n2 = tmp;
            }
          
        
        
    
//see if edge between these two vertices exist or not
//And if does exist them of which kind

   let work=0;

   for(let j=0;j<edges.length;j++){
       if(edges[j]['from']==n1 &&edges[j]['to']==n2){
           if(edges[j]['type']===0){
               work=1;
           }else{
               work=2;
           }
       }
   }


    // Adding edges to the graph
    // If works == 0, you can add bus as well as plane between vertices
    // If works == 1, you can only add plane between them

     if(work<=1){
         if(work==0&& i<V/4){
             edges.push({
                type: 0,
                from: n1,
                to: n2,
                color: 'orange',
                label: String(Math.floor(Math.random() * 70) + 31)
             })
         }
         else {
            // Adding a plane
            console.log(n1+" "+n2+ " "+V);
            edges.push({
                type: 1,
                from: n1,
                to: n2,
                color: 'green',
                label: String(Math.floor(Math.random() * 30) + 1)
            });
        }

         i++;

                     }


            }

    }
    
    src=1;
    dst = V;
    curr_data = {
        nodes: nodes,
        edges: edges
    }
}


gengraph.onclick = function () {
    // Create new data and display the data
    createData();
    network.setData(curr_data);
    questiontxt.innerText = 'Find least time path from '+cities[src-1]+' to '+cities[dst-1];
    infotxt.style.display = "inline";
    questiontxt.style.display = "inline";
    mynetwork2.style.display = "none";
    distancemeter.innerHTML=`Distance:`;
};

solve.onclick = function () {
    // Create graph from data and set to display
    questiontxt.style.display  = "none";
    infotxt.style.display  = "none";
    mynetwork2.style.display = "inline";
    let mydata=solvedata();
    let ans={
        nodes:mydata.nodes,
        edges:mydata.edges
    }
    network2.setData(ans);
    distancemeter.innerHTML=`Distance:${mydata.distance}`;
};

function djikstra(graph, v, src) {

let vis=Array(v).fill(0);
let dist=[];

for(let i=0;i<v;i++){
    dist.push([10000,-1]);
}

dist[src][0]=0;

for(let i=0;i<v-1;i++){
let minindx=-1;

for(let j=0;j<V;j++){
   if(vis[j]==0){
      
 if(minindx==-1||dist[j][0]<dist[minindx][0])
      minindx=j;
    
    }

}

vis[minindx]=1;

for(let j=0 ;j<graph[minindx].length;j++){
let edge=graph[minindx][j];

  if(vis[edge[0]]==0&&dist[minindx][0]+edge[1]<dist[edge[0]][0]){
      dist[edge[0]][0]=dist[minindx][0]+edge[1];
      dist[edge[0]][1] = minindx;
             }

         }
    }

    return dist;
}


function createGraph(data){

 let graph=[];

 for(let i=1;i<=V;i++){
     graph.push([]);
 }

 for(let i=0;i<data['edges'].length;i++){
  

    let edge=data['edges'][i];

    if(edge['type']===1)
    continue;
   graph[edge['to']-1].push([edge['from']-1,parseInt(edge['label'])]);
   graph[edge['from']-1].push([edge['to']-1,parseInt(edge['label'])]);
}
return graph;

 }



 function takeplane(edges, dist1, dist2, mn_dist){

    let plane = 0;
    let p1=-1, p2=-1;
    for(let pos in edges){
        let edge = edges[pos];
        if(edge['type']===1){
            let to = edge['to']-1;
            let from = edge['from']-1;
            let wght = parseInt(edge['label']);
            if(dist1[to][0]+wght+dist2[from][0] < mn_dist){
                plane = wght;
                p1 = to;
                p2 = from;
                mn_dist = dist1[to][0]+wght+dist2[from][0];
            }
            if(dist2[to][0]+wght+dist1[from][0] < mn_dist){
                plane = wght;
                p2 = to;
                p1 = from;
                mn_dist = dist2[to][0]+wght+dist1[from][0];
            }
        }
    }
    return {plane, p1, p2,mn_dist};

}


function solvedata(){
   const data=curr_data;
   
   //create adjcancy list
   const graph = createGraph(data);
     
   let dist1=djikstra(graph,V,src-1);
   let dist2 = djikstra(graph,V,dst-1);

   let min_dist=dist1[dst-1][0];


   // See if plane should be used
   let {plane, p1, p2,mn_dist} = takeplane(data['edges'], dist1, dist2, min_dist);
   let new_edges = [];
   

   new_edges
   if(plane != 0){


    new_edges.push({arrows:{to:{enabled:true}},from:p1+1,to:p2+1,color: 'green',label: String(plane)});


new_edges.push(...pushEdges(dist1,p1,false));
new_edges.push(...pushEdges(dist2,p2,true));


   }else{
    new_edges.push(...pushEdges(dist1,p1,false));
   }

const ans={

    nodes: data['nodes'],
    edges: new_edges,
    distance:mn_dist
};
return ans;

}



 function pushEdges(dist,curr,reverse){
 let tmpedges=[];
 while(dist[curr][0]!=0){

 let parent=dist[curr][1];
 if(reverse){
tmpedges.push({arrows:{to:{enabled:true}} ,from:curr+1,to:parent+1,label:String(dist[curr][0] - dist[parent][0]), color: 'orange' });
}
 else
tmpedges.push({arrows: { to: { enabled: true}},from: parent+1, to: curr+1, color: 'orange', label: String(dist[curr][0] - dist[parent][0])});
            curr = parent;
        }
return tmpedges;

}


gengraph.click();


  }




















