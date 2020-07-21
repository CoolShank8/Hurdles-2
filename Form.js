class Form{
    constructor()
    {
        this.FormElements = []
    }

    CreateButton(ButtonText, Position, FunctionToRun)
    {
        var x  = Position.x
        var y = Position.y

        var newButton = createButton(ButtonText)
        newButton.position(x,y)

        if (FunctionToRun != undefined)
        {
            newButton.mousePressed(()  => {
                FunctionToRun()
            })
        }

        this.FormElements.push(newButton)

        return newButton
    }

    CreateElement(Text, Position, Size)
    {
        var x  = Position.x
        var y = Position.y

        var Element

        if (Size != undefined)
        {
            Element = createElement(Size)
        }

        else{
            Element = createElement("h2")
        }

        Element.html(Text)
        Element.position(x,y)

        this.FormElements.push(Element)

        return Element
    }


    CreateInput(DefaultText, Position)
    {
        var x  = Position.x
        var y = Position.y

        var input = createInput(DefaultText)
        input.position(x,y)

        this.FormElements.push(input)

        return input
    }

    Hide()
    {
        for (var i = 0; i < this.FormElements.length; i++)
        {
            this.FormElements[i].hide()
        }
    }

    Show()
    {
        for (var i = 0; i < this.FormElements.length; i++)
        {
            this.FormElements[i].show()
        }
    }
}