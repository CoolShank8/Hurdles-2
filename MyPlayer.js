class MyPlayer
{

    constructor(Index)
    {
        this.Index = Index
        this.Position = Vector2.new(displayWidth/4 - 400,this.Index * 300 - 50)
        this.ref = "Player" + this.Index
        this.Name = UserName

        OriginalY  = this.Position.y

        database.ref("Players").update({
            [this.ref]: {
              Position: {
                x: this.Position.x,
                y:this.Position.y
              },
              Name: this.Name
            }
          })

        database.ref("/").update({
            "PlayerCount": this.Index
        })

        database.ref("AllPlayerIndexes").update({
            [this.ref]: this.ref
        })

        ThingsToUpdate.push(this)
    }

    Update()
    {   
        database.ref('Players').update({
            [this.ref]: {
                Position: {
                    x: this.Position.x,
                    y: this.Position.y
                },
                Name: this.Name
            }
        });
    }

}