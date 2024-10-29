# Enhanced Shutter Card

[![hacs_badge](https://img.shields.io/badge/HACS-Default-orange.svg?style=for-the-badge)](https://github.com/custom-components/hacs)
[![buymeacoffee_badge](https://img.shields.io/badge/Donate-Buymeacoffee-orange?style=for-the-badge)](https://buymeacoffee.com/tijq3xcipj)


This card allows to open, close or set a shutter to the opening rate you want.
It is a follow-up of [Deeiayfool/Shuttercard](https://github.com/Deejayfool/hass-shutter-card), a nice Card for Shutters. I started with a simple change for the motion of the shutters, but soon it became a great update. Due to the inactivity of this card, I decided to add this one also to HACS as Enhanced Sutter Card.

It supports all options of the original Card, but also graphical options like different backrounds, windows an shutters.
Also the sizes of every shuter can be altered:

![Enhanced Shutter Card](EnhancedShutterCard.gif)

## Configuration

### General

| Name | Type | Required | Default | Description
| ---- | ---- | -------- | ------- | -----------
| type | string | True | - | Must be "custom:shutter-card"
| title | string | False | - | Title of the card

### Entities

| Name | Type | Required | Default | Description
| ---- | ---- | -------- | ------- | -----------
| entity | string | True | - | The shutter entity ID
| name | string | False | _Friendly name of the entity_ | Name to display for the shutter
| buttons_position | string | False | `left` | Set buttons on `left`, `right`, `top` or `bottom` of the shutter
| title_position | string | False | `top` | Set title on `top` or on `bottom` of the shutter
| invert_percentage | boolean | False | `false` | Set it to `true` if your shutter is 100% when it is closed, and 0% when it is opened
| can_tilt | boolean | False | `false` | Set it to `true` if your shutters support tilting.
| partial_close_percentage | int | False | `0` | Set it to a percentage (0-100) if you want to be able to quickly go to this "partially closed" state using a button.
| offset_closed_percentage | int | False | `0` | Set it to a percentage (0-100) of travel that will still be considered a "closed" state in the visualization.
| always_percentage | boolean | False | `false` | If set to `true`, the end states (opened/closed) will be also as numbers (0 / 100 % ) instead of a text
| shutter_width_px | int | False | `153` | Set shutter visualization width in px. You can make it thicker or narrower to fit your layout.
| disable_end_buttons | boolean | False | `false` | If set to `true`, the end states (opened/closed) will also deactivate the buttons for that direction (i.e. the "up" button will be disabled when the shutters are fully open)

_Remark : you can also just give the entity ID (without to specify `entity:`) if you don't need to specify the other configurations._

### Sample

```yaml
type: 'custom:shutter-card'
title: My shutters
entities:
  - entity: cover.left_living_shutter
    name: Left shutter
    buttons_position: left
    title_position: bottom
  - cover.bedroom_shutter
```

## Install

If you use HACS, the resources will automatically be configured with the needed file.

If you don't use HACS, you can download js file from [latest releases](https://github.com/Deejayfool/hass-shutter-card/releases). Drop it then in `www` folder in your `config` directory. Next add the following entry in lovelace configuration:

```yaml
resources:
  - url: /local/hass-shutter-card.js
    type: module
```
