var database = firebase.database()

var ThingsToUpdate = []

var UserName

var PlayerCount

var ThisPlayer

var GameState = "FillingForm"

var PlayerModels = {}

var AllPlayersInfo

var Winners = []

var WinnerCount = 0

var Jumping = false

var GoingDown = false

var OriginalY

var Hurdles = []

var Paused = false

var RunnerImage

function preload()
{
  RunnerImage = loadImage("Runner.png")
}

async function setup() {
  

  Part.DefaultProperties = {
    Position: Vector2.new(displayWidth/2, 200),
    Size:  Vector2.new(50,50),
    Texture: undefined,
    TextureVisibility: 1,
    Color: "grey",
    Angle: 0,
    Anchored: true,
    Shape: "Rect",
    Velocity: Vector2.new(0,0),
    Density: 3
}



  createCanvas(displayWidth,800);

  PlayerCount = await WaitForPlayerCount()

  database.ref("WinnerCount").on("value", function(data)
  {
    WinnerCount = data.val()
  })

  database.ref("Winners").on("value", function(data)
  {
    Winners = data.val()
  })

  database.ref("PlayerCount").on("value", function(data)
  {
    PlayerCount = data.val()

    if (PlayerCount == 4)
    {
      GameState = "Play"

      for (var plr in AllPlayersInfo)
      {
        var NewModel = Part.new({
          Position: Vector2.new(AllPlayersInfo[plr].Position.x, AllPlayersInfo[plr].Position.y),
          Texture: RunnerImage
        })

        CreateHurdleLane(NewModel.Position.y)

        PlayerModels[plr] = NewModel
      }
    }

    console.log(GameState)
  })

  database.ref("Players").on("value", function(data)
  { 
    AllPlayersInfo = data.val()
  })

  var PlayerInfoForm = new Form()

  var PlayerInput = PlayerInfoForm.CreateInput("Enter your name",Vector2.new(displayWidth/2,300))
  var StartButton = PlayerInfoForm.CreateButton("Start!", Vector2.new(displayWidth/2,400), function()
  {
    UserName = PlayerInput.value()

    ThisPlayer = new MyPlayer(PlayerCount + 1)

    StartButton.hide()
    PlayerInput.hide()

  })

  var ControlForm = new Form()

  ControlForm.CreateButton("Restart", Vector2.new(100,camera.position.y), function()
  {
    ThisPlayer.Position = Vector2.new(displayWidth/4,ThisPlayer.Index * 300 - 50)
  })

  ControlForm.CreateButton("Pause", Vector2.new(100,camera.position.y + 30), function()
  {
    if (Paused == true)
    {
      Paused = false
    }

    else
    {
      Paused = true
    }
  })
}


function draw() {

  background("white");  


  if (GameState == "Play")
  {

    camera.position.x = ThisPlayer.Position.x
    camera.position.y = ThisPlayer.Position.y


    for (var i = 0; i < Hurdles.length; i ++)
    {
      if (AreRectanglesColliding(PlayerModels[ThisPlayer.ref], Hurdles[i]))
      {
        GameState = "End"
      }
    }

    if (Paused == false && Jumping == false)
    {
    
        ThisPlayer.Position =  Vector2.Add(ThisPlayer.Position, Vector2.new(11,0))
    
        if (ThisPlayer.Position.x > displayWidth * 2 )
        {
          GameState = "End"
      
          database.ref("Winners").update({
            [WinnerCount + 1]: AllPlayersInfo[ThisPlayer.ref]
          })
      
          database.ref("/").update({
            "WinnerCount": WinnerCount + 1
          })
        }
    }


    for (var plr in AllPlayersInfo)
    {
      PlayerModels[plr].Position = Vector2.new( AllPlayersInfo[plr].Position.x,  AllPlayersInfo[plr].Position.y)
    }

    if (Jumping == true)
    {

      console.log("GOING DOWN")

      ThisPlayer.Position = Vector2.Add(ThisPlayer.Position, Vector2.new(0,-4))

      var Distance = Vector2.Sub(ThisPlayer.Position, Vector2.new(ThisPlayer.Position.x, OriginalY)).Magnitude()

      if (Distance > 200)
      {
        GoingDown = true
        Jumping = false
      }

    }

    if (GoingDown == true)
    {
      ThisPlayer.Position = Vector2.Add(ThisPlayer.Position, Vector2.new(0,6))

      var Distance = Vector2.Sub(ThisPlayer.Position, Vector2.new(ThisPlayer.Position.x, OriginalY)).Magnitude()

      if (ThisPlayer.Position.y - OriginalY >= 0)
      {
        GoingDown = false
        Jumping = false
      }

    }


  }

  if (GameState == "FillingForm")
  {

    console.log(GameState)

    text("Press j to jump", displayWidth/2, 600)

    text("Waiting for " + (4 - PlayerCount) + " more players!", displayWidth/2, 500)
  }

  if (GameState == "End")
  {
    GenerateLeaderBoard()
  }

  if (GameState != "End")
  {
    UpdateAll()
  }
  drawSprites();
}

function keyPressed()
{

  if (keyCode == 74  && GameState == "Play" && Jumping == false && GoingDown == false && Paused == false)
  {
    Jumping = true
  }
}

function UpdateAll()
{
    for (var i = 0; i < ThingsToUpdate.length; i ++)
    {
      ThingsToUpdate[i].Update()
    }
}

async function WaitForPlayerCount()
{
  var PlayerCount = await database.ref("PlayerCount").once("value")

  return PlayerCount
}

function GenerateLeaderBoard()
{
  push()

  for (var i in Winners)
  {
    if (i == 1)
    {
      push()
      fill("gold")
    }

    textSize(40)
    text(i + ":" +   Winners[i].Name, camera.position.x + 100, camera.position.y + i * 150)
    pop()
  }

  pop()
}

function CreateHurdleLane(YAXIS)
{
  for (var x = displayWidth/4  + 100; x <= displayWidth * 2; x+= 350 )
  {
    var Hurdle = Part.new({
      Position: Vector2.new(x, YAXIS),
      Size: Vector2.new(25,100),
      Color: "Red"
    })

    Hurdles.push(Hurdle)
  }
}

function AreRectanglesColliding(rect1, rect2)
{
  if (rect1.Position.x < rect2.Position.x + rect2.Size.x &&
    rect1.Position.x + rect1.Size.x > rect2.Position.x &&
    rect1.Position.y < rect2.Position.y + rect2.Size.y &&
    rect1.Position.y + rect1.Size.y > rect2.Position.y) 
    
    {
     return true
    }

    else
    {
      return false
    }
}