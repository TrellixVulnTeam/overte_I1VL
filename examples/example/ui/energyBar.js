//  energyBar.js
//  examples/ui
//
//  Created by Eric Levin on 1/4/15
//  Copyright 2015 High Fidelity, Inc.
//
//  This script adds an energy bar overlay which displays the amount of energy a user has left for grabbing and moving objects
//
//  Distributed under the Apache License, Version 2.0.
//  See the accompanying file LICENSE or http://www.apache.org/licenses/LICENSE-2.0.html
//

Script.include("../../libraries/utils.js");
var energyColor = {red: 0, green: 200, blue: 0};
var lowEnergyColor = {red: 255, green: 0, blue: 0};
var totalWidth = 200;
var paddingRight = 50;
var xPosition = Window.innerWidth - totalWidth - paddingRight;
var lowEnergyThreshold = 0.3;
var currentEnergy = 1.0;
var energyLossRate = 0.003;
var energyChargeRate = 0.003;
var isGrabbing = false;
var refractoryPeriod = 2000;

var lastAvatarVelocity = MyAvatar.getVelocity(); 
var lastAvatarPosition = MyAvatar.position;

var background = Overlays.addOverlay("text", {
    x: xPosition,
    y: 20,
    width: totalWidth,
    height: 10,
    backgroundColor: {red: 184, green: 181, blue: 178}
})

var bar = Overlays.addOverlay("text", {
    x: xPosition,
    y: 20,
    width: totalWidth,
    height: 10,
    backgroundColor: energyColor
});


// Takes an energy value between 0 and 1 and sets energy bar width appropriately
function setEnergy(energy) {
    energy = clamp(energy, 0, 1);
    var barWidth = totalWidth * energy;
    var color = energy <= lowEnergyThreshold ? lowEnergyColor: energyColor;
    Overlays.editOverlay(bar, { width: barWidth, backgroundColor: color});
}

function avatarAccelerationEnergy() {
    var AVATAR_MOVEMENT_ENERGY_CONSTANT = 0.001;
    var velocity = MyAvatar.getVelocity(); 
    var dV = Vec3.subtract(velocity, lastAvatarVelocity);
    var dE = Vec3.length(lastAvatarVelocity) * Vec3.length(dV) * AVATAR_MOVEMENT_ENERGY_CONSTANT;
    lastAvatarVelocity = velocity;  
    if (dE > 0.01) {
        print("de " + dE);
    }
    return dE;
}

function teleported() {
    var MAX_AVATAR_MOVEMENT_PER_FRAME = 30.0;
    var position = MyAvatar.position; 
    var dP = Vec3.length(Vec3.subtract(position, lastAvatarPosition));
    lastAvatarPosition = position;
    return (dP > MAX_AVATAR_MOVEMENT_PER_FRAME);
}

function audioEnergy() {
    var AUDIO_ENERGY_CONSTANT = 0.000001;
    return MyAvatar.audioLoudness * AUDIO_ENERGY_CONSTANT;
}

function update() {
    // refill energy
    currentEnergy += energyChargeRate;

    //  Avatar acceleration
    currentEnergy -= avatarAccelerationEnergy();

    // Teleport cost 
    if (teleported()) {
        currentEnergy = 0;
    }

    // Making sounds
    currentEnergy -= audioEnergy(); 


    currentEnergy = clamp(currentEnergy, 0, 1);
    setEnergy(currentEnergy);
}

function cleanup() {
    Overlays.deleteOverlay(background);
    Overlays.deleteOverlay(bar);
}

Script.update.connect(update);
Script.scriptEnding.connect(cleanup);
