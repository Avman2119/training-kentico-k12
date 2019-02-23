﻿using System;

using Kentico.Forms.Web.Mvc;
using Kentico.PageBuilder.Web.Mvc;

namespace MedioClinic.Models.Widgets
{
    public class SlideshowWidgetProperties : IWidgetProperties
    {
        public Guid[] ImageIds { get; set; }

        [EditingComponent(IntInputComponent.IDENTIFIER, Label = "{$Widget.Slideshow.TransitionDelay$}", Order = 1)]
        public int TransitionDelay { get; set; } = 5000;

        [EditingComponent(IntInputComponent.IDENTIFIER, Label = "{$Widget.Slideshow.TransitionSpeed$}", Order = 2)]
        public int TransitionSpeed { get; set; } = 300;

        [EditingComponent(CheckBoxComponent.IDENTIFIER, Label = "{$Widget.Slideshow.DisplayArrowSigns$}", Order = 3)]
        public bool DisplayArrowSigns { get; set; } = true;

        [EditingComponent(CheckBoxComponent.IDENTIFIER, Label = "{$Widget.Slideshow.EnforceDimensions$}", Order = 4)]
        public bool EnforceDimensions { get; set; }

        [EditingComponent(IntInputComponent.IDENTIFIER, Label = "{$Widget.Slideshow.Width$}", Order = 5)]
        public int Width { get; set; } = 800;

        [EditingComponent(IntInputComponent.IDENTIFIER, Label = "{$Widget.Slideshow.Height$}", Order = 6)]
        public int Height { get; set; } = 600;
    }
}